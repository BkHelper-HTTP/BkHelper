from datetime import datetime, timedelta

def parse_weeks(week_series: str) -> list[int]:
    """Tách chuỗi tuần '35|36|--|38|' → [35, 36, 38]"""
    return [int(w) for w in week_series.split("|") if w and w != "--"]

def get_date_from_week(year: int, week: int, day_of_week: int) -> str | None:
    """Chuyển (năm, tuần, thứ) → ngày thực tế (yyyy-mm-dd)."""
    if day_of_week < 2 or day_of_week > 8:
        return None
    # ISO week: tuần 1 bắt đầu từ thứ 2 có ngày 4/1
    jan_4 = datetime(year, 1, 4)  # Ngày 4/1 luôn nằm trong tuần 1 ISO
    weekday_of_jan4 = jan_4.isoweekday()  # Thứ của ngày 4/1 (1=Thứ 2, ..., 4=Thứ 5, 7=Chủ nhật)
    
    start_of_week1 = jan_4 - timedelta(days=weekday_of_jan4 - 1)
    
    # Tính ngày cần tìm
    # (week-1) tuần + (day_of_week-1) ngày
    target_date = start_of_week1 + timedelta(weeks=week-1, days=day_of_week-2)
    
    return target_date.strftime("%Y-%m-%d")

def calc_duration(start: str, end: str) -> str:
    """Tính thời lượng học, ví dụ 7:00 → 8:50 => 1h50."""
    try:
        sh, sm = map(int, start.split(":"))
        eh, em = map(int, end.split(":"))
        diff = (eh * 60 + em) - (sh * 60 + sm)
        h, m = divmod(diff, 60)
        return f"{h}h{m}" if m else f"{h}h"
    except Exception:
        return ""

def transform_schedule_to_agenda(raw_data: list[dict]) -> list[dict]:
    """Chuyển dữ liệu thô từ MyBK → dữ liệu FE cần."""
    grouped = {}

    for item in raw_data:
        year = item.get("calendarYear")
        weeks = parse_weeks(item.get("weekSeriesDisplay", ""))
        day_of_week = item.get("dayOfWeek")
        start_time = item.get("startTime")
        end_time = item.get("endTime")
        subject = item.get("subject", {})
        title = subject.get("nameVi") or subject.get("nameEn") or "Chưa có tên"

        for week in weeks:
            date = get_date_from_week(year, week, day_of_week)
            if not date:
                continue  # Bỏ qua môn không có ngày cụ thể

            if date not in grouped:
                grouped[date] = []

            grouped[date].append({
                "hour": start_time,
                "duration": calc_duration(start_time, end_time),
                "title": title,
                **item  # giữ lại toàn bộ thông tin gốc
            })

    return [{"title": date, "data": data} for date, data in sorted(grouped.items())]
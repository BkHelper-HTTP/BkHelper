from datetime import timezone, timedelta

VN_TZ = timezone(timedelta(hours=7))

def to_vn_time(dt):
    if dt is None:
        return None
    return dt.astimezone(VN_TZ)
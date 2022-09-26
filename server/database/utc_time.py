import time
import datetime

def utc_time():
    LocalTime = datetime.datetime.now()
    EpochSecond = time.mktime(LocalTime.timetuple())
    utcTime = datetime.datetime.utcfromtimestamp(EpochSecond)
    return utcTime
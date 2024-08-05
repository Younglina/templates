import { isAccountLoggedIn } from "./auth";
import { useMainStore } from "@/store";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

export function isTrackPlayable(track) {
  let result = {
    playable: true,
    reason: "",
  };
  if (track?.privilege?.pl > 0) {
    return result;
  }
  // cloud storage judgement logic
  if (isAccountLoggedIn() && track?.privilege?.cs) {
    return result;
  }
  const store = useMainStore();
  if (track.fee === 1 || track.privilege?.fee === 1) {
    if (isAccountLoggedIn() && store.baseData.user.vipType === 11) {
      result.playable = true;
    } else {
      result.playable = false;
      result.reason = "VIP Only";
    }
  } else if (track.fee === 4 || track.privilege?.fee === 4) {
    result.playable = false;
    result.reason = "付费专辑";
  } else if (
    track.noCopyrightRcmd !== null &&
    track.noCopyrightRcmd !== undefined
  ) {
    result.playable = false;
    result.reason = "无版权";
  } else if (track.privilege?.st < 0 && isAccountLoggedIn()) {
    result.playable = false;
    result.reason = "已下架";
  }
  return result;
}

export function mapTrackPlayableStatus(tracks, privileges = []) {
  if (tracks?.length === undefined) return tracks;
  return tracks.map((t) => {
    const privilege = privileges.find((item) => item.id === t.id) || {};
    if (t.privilege) {
      Object.assign(t.privilege, privilege);
    } else {
      t.privilege = privilege;
    }
    let result = isTrackPlayable(t);
    t.playable = result.playable;
    t.reason = result.reason;
    return t;
  });
}

export function formatNum(num) {
  if (!num) return "";
  let i = 0;
  while (num >= 10000) {
    num = num / 10000;
    i++;
  }
  return Math.floor(num * 100) / 100 + ["", "万", "亿"][i];
}

export function formatTime(Milliseconds, format = "HH:MM:SS") {
  if (!Milliseconds) return "";
  dayjs.extend(duration);
  dayjs.extend(relativeTime);

  let time = dayjs.duration(Milliseconds);
  let hours = time.hours().toString();
  let mins = time.minutes().toString();
  let seconds = time.seconds().toString().padStart(2, "0");

  if (format === "HH:MM:SS") {
    return hours !== "0"
      ? `${hours}:${mins.padStart(2, "0")}:${seconds}`
      : `${mins}:${seconds}`;
  } else if (format === "Human") {
    return hours !== "0" ? `${hours} '小时' ${mins} '分钟'` : `${mins} '分钟'`;
  }
}
export function formatDate(timestamp) {
  if (!timestamp) return "";
  return dayjs(timestamp).format("YYYY年MM月DD日");
}

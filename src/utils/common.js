import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { isAccountLoggedIn } from "./auth";
import { useMainStore } from "@/store";

export function isTrackPlayable(track) {
  const result = {
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
    const result = isTrackPlayable(t);
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

  const time = dayjs.duration(Milliseconds);
  const hours = time.hours().toString();
  let mins = time.minutes().toString();
  const seconds = time.seconds().toString().padStart(2, "0");
  if (seconds >= 30) {
    mins = (1 + +mins).toString();
  }

  if (format === "HH:MM:SS") {
    return hours !== "0"
      ? `${hours}:${mins.padStart(2, "0")}:${seconds}`
      : `${mins}:${seconds}`;
  } else if (format === "Human") {
    return hours !== "0" ? `约 ${hours} 小时 ${mins} 分钟` : `约 ${mins} 分钟`;
  }
}
export function formatDate(timestamp, format = "YYYY年MM月DD日") {
  if (!timestamp) return "";
  return dayjs(timestamp).format(format);
}

export function validateEmail(email, password = "") {
  const emailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/i;
  if (email === "" || password === "" || !emailReg.test(email)) {
    MessageBox({ title: "登录失败", message: "邮箱不正确", showFooter: true });
    return false;
  }
  return true;
}

export function resizeImage(imgUrl, size = 512) {
  if (!imgUrl) return "";
  let httpsImgUrl = imgUrl;
  if (imgUrl.slice(0, 5) !== "https") {
    httpsImgUrl = `https${imgUrl.slice(4)}`;
  }
  return `${httpsImgUrl}?param=${size}y${size}`;
}

export function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return Number.parseInt(Math.random() * minNum + 1, 10);
    case 2:
      return Number.parseInt(
        Math.random() * (maxNum - minNum + 1) + minNum,
        10
      );
    default:
      return 0;
  }
}

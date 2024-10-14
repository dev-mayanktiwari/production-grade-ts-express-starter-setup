/* eslint-disable @typescript-eslint/no-unsafe-argument */
 
 
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createLogger, transports, format } from "winston";
import { ConsoleTransportInstance, FileTransportInstance } from "winston/lib/winston/transports";
import util from "util";
import moment from "moment";
import { AppConfig } from "../config";
import { EApplicationEnvirontment } from "../constant/application";
import path from "path";

const consoleLogFormat = format.printf((info) => {
  const { level, timestamp, message, meta = {} } = info;
  const customLevel = level.toUpperCase();

  const customTimestamp = moment(timestamp).format("YYYY-MM-DD HH:mm:ss");

  const customMessage = message;
  const customMeta = util.inspect(meta, { showHidden: false, depth: null });
  const customLog = `${customLevel} - ${customTimestamp} - ${customMessage}\n${"META"} ${customMeta}\n`;

  return customLog;
});

const fileLogFormat = format.printf((info) => {
  const { level, timestamp, message, meta = {} } = info;
  const logMeta: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(meta)) {
    if (value instanceof Error) {
      logMeta[key] = [
        {
          name: value.name,
          message: value.message,
          trace: value.stack || ""
        }
      ];
    } else {
      logMeta[key] = value;
    }
  }
  const logData = {
    level: level.toUpperCase(),
    timestamp: moment(timestamp).format("YYYY-MM-DD HH:mm:ss"),
    message,
    meta: logMeta
  };
  return JSON.stringify(logData, null, 2);
});

const consoleTransport = (): Array<ConsoleTransportInstance> => {
  if (AppConfig.get("ENV") === EApplicationEnvirontment.DEVELOPMENT) {
    return [
      new transports.Console({
        level: "info",
        format: format.combine(format.timestamp(), consoleLogFormat)
      })
    ];
  }
  return [];
};

const fileTransport = (): Array<FileTransportInstance> => {
  return [
    new transports.File({
      filename: path.join(__dirname, `../../logs/${AppConfig.get("ENV")}.log`),
      level: "info",
      format: format.combine(format.timestamp(), fileLogFormat)
    })
  ];
};

export default createLogger({
  defaultMeta: {
    meta: {}
  },
  transports: [...fileTransport(), ...consoleTransport()]
});


import {PrrReport} from './monitor/PrrMonitor';
import {PrrReports} from "@shared/prr/PrrReports";

/**
 * This class keeps track of prr reports for chrome tabs
 */
export class PrrReportManager {
  constructor(private readonly prrReports: PrrReports) {
  }

  clearByTabId = (id: number): void => {
    this.prrReports.remove(id);
  };

  add(id: number, report: PrrReport): void {
    return this.prrReports.add(id, report);
  }

  getReport(id: number): PrrReport {
    return this.prrReports.get(id);
  }

  reset(id: number): void {
    this.prrReports.remove(id);
  }
}

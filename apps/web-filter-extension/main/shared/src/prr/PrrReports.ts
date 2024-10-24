import {PrrReport} from "apps/web-filter-extension/main/background/src/prr/monitor/PrrMonitor";

/**
 * This class is map of Prr Report for chrome tabs
 */
export class PrrReports {
  private readonly reports = new Map<number, any>();
  get = (id: number): any => {
    return this.reports.get(id);
  };

  add = (id: number, report: any): void => {
    this.reports.set(id, report);
  };

  remove(id: number) {
    this.reports.delete(id);
  }

  list() {
    return this.reports;
  }
}

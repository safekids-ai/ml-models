import {PrrReports} from '@shared/prr/PrrReports';
import {PrrReport} from './monitor/PrrMonitor';
import {PrrCategory} from '@shared/types/PrrCategory';
import {PrrTrigger} from '@shared/types/message_types';
import {PrrLevel} from '@shared/types/PrrLevel';

describe('Prr reports test', () => {
  let prrReports: PrrReports;
  beforeEach(async () => {
    prrReports = new PrrReports();
  });
  it('Should add/get/remove prr reports to prrReports map', () => {
    const prrReport1: PrrReport = {
      fullWebUrl: 'https://www.dummy.com?p1=1&p2=2',
      category: PrrCategory.PROXY,
      tabId: 12345,
      prrTriggerId: PrrTrigger.URL_INTERCEPTED,
      url: 'dummy.com',
      prrTriggered: true,
      level: PrrLevel.ONE,
    };
    prrReports.add(12345, prrReport1);

    const prrReport2: PrrReport = {
      fullWebUrl: 'https://www.poodle.com?p1=1&p2=2',
      category: PrrCategory.EXPLICIT,
      tabId: 45678,
      prrTriggerId: PrrTrigger.AI_NLP,
      url: 'poodle.com',
      prrTriggered: true,
      level: PrrLevel.ONE,
    };
    prrReports.add(45678, prrReport2);

    const report1 = prrReports.get(12345);
    expect(report1).toMatchObject(prrReport1);

    const report2 = prrReports.get(45678);
    expect(report2).toMatchObject(prrReport2);

    prrReports.remove(45678);

    const report2Removed = prrReports.get(45678);
    expect(report2Removed).toBeFalsy();
  });
});

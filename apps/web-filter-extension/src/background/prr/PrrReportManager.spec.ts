import {PrrReportManager} from './PrrReportManager';
import {PrrReports} from '@shared/prr/PrrReports';
import {PrrReport} from './monitor/PrrMonitor';
import {jest} from '@jest/globals';

describe('Prr report manager test', () => {
  let prrReportManager: PrrReportManager;
  const prrReports = new PrrReports();
  beforeEach(async () => {
    prrReportManager = new PrrReportManager(prrReports);
  });
  it('Should clear report tab id', async () => {
    //given
    const id = 1;

    //mock dependencies
    jest.spyOn(prrReports, 'remove').mockReturnValueOnce();

    //when
    prrReportManager.clearByTabId(id);

    //then
    expect(prrReports.remove).toBeCalledTimes(1);
    expect(prrReports.remove).toBeCalledWith(id);
  });

  it('Should add report by tab id', async () => {
    //given
    const id = 2;
    const report = {} as PrrReport;

    //mock dependencies
    jest.spyOn(prrReports, 'add').mockReturnValueOnce();

    //when
    prrReportManager.add(id, report);

    //then
    expect(prrReports.add).toBeCalledTimes(1);
    expect(prrReports.add).toBeCalledWith(id, report);
  });

  it('Should get report by tab id', async () => {
    //given
    const id = 123;

    //mock dependencies
    jest.spyOn(prrReports, 'get').mockReturnValueOnce('');

    //when
    prrReportManager.getReport(id);

    //then
    expect(prrReports.get).toBeCalledTimes(1);
    expect(prrReports.get).toBeCalledWith(id);
  });

  it('Should reset report by tab id', async () => {
    //given
    const id = 3;

    //mock dependencies
    jest.spyOn(prrReports, 'remove').mockReturnValueOnce();

    //when
    prrReportManager.reset(id);

    //then
    expect(prrReports.remove).toBeCalledWith(id);
  });
});

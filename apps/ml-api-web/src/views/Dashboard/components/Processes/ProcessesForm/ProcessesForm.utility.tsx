import { uniqBy } from 'lodash';
import { validateProcessName } from '../../../../../utils/validations';
import { IFilteredProcesses, IProcesses } from '../Processes.types';

const removeDuplicateProcesses = (newProcesses: IProcesses[], oldProcesses: IProcesses[]): IProcesses[] => {
    const uniqueInputProcesses = uniqBy(newProcesses, (p) => p.name.trim().toLowerCase());
    return uniqueInputProcesses.reduce((processes: IProcesses[], currentProcess: IProcesses) => {
        const duplicate = oldProcesses.some((p) => p.name.trim().toLowerCase() === currentProcess.name.trim().toLowerCase());
        if (!duplicate) processes.push(currentProcess);
        return processes;
    }, []);
};

const filterDuplicates = (newProcess: IProcesses[], oldProcess: IProcesses[]): IProcesses[] => {
    let newProcesses: IProcesses[] = [...newProcess, ...oldProcess];
    let finalProcesses: IProcesses[] = [];
    const removeProcesses = (name: string) => newProcesses.filter((nProcess) => nProcess.name.trim().toLowerCase() !== name.trim().toLowerCase());
    const getDuplicateProcesses = (name: string) => newProcesses.filter((nProcess) => nProcess.name.trim().toLowerCase() === name.trim().toLowerCase());
    const getDuplicateProcessesWithId = (name: string) =>
        newProcesses.filter((nProcess) => nProcess.name.trim().toLowerCase() === name.trim().toLowerCase() && nProcess.hasOwnProperty('id'));
    const getValidProcesses = (fProcess: IProcesses[]) => fProcess.filter((nProcess) => nProcess.isInvalid === false);
    const getInvalidProcesses = (fProcess: IProcesses[]) => fProcess.filter((nProcess) => nProcess.isInvalid === true);
    const getPredefinedProcesses = (fProcess: IProcesses[]) => fProcess.filter((nProcess) => !nProcess.hasOwnProperty('isInvalid'));

    while (newProcesses.length > 0) {
        /**
         *  newProcesses array contains both newly added Processes and old Processes.
         *  Here we check whether the first element of newProcess has duplicates in the array or not.
         *  If it has duplicates, we only add a single entry into final array and imbed the isInvalid bit for color green/red.
         *  After that we remove duplicate Processes from the array newProcesses, and the loop will continue until the array is empty.
         *  */
        let selectedProcess = { ...newProcesses[0] };

        let duplicates = getDuplicateProcessesWithId(selectedProcess.name); //getDuplicateProcess(selectedProcess.name);
        if (duplicates.length > 0) {
            const newSelectedProcess = { ...duplicates[0] };
            newProcesses = removeProcesses(newSelectedProcess.name);
            finalProcesses.push(newSelectedProcess);
        } else {
            duplicates = getDuplicateProcesses(selectedProcess.name);
            if (duplicates.length > 1) selectedProcess['isInvalid'] = !!validateProcessName(selectedProcess.name);
            newProcesses = removeProcesses(selectedProcess.name);
            finalProcesses.push(selectedProcess);
        }
    }
    /**
     *  Here we are combining the end result in an order, on the basis of:
     *  First the list will contain invalid Processes
     *  After that list will contain valid Processes
     *  At the end the list will contain predefined Processes that arent inserted again by user.
     */
    finalProcesses = [...getInvalidProcesses(finalProcesses), ...getValidProcesses(finalProcesses), ...getPredefinedProcesses(finalProcesses)];
    return finalProcesses;
};

const addProcesses = (commaSeparatedProcesses: string, selectedKidId: string, allProcesses: IFilteredProcesses[]) => {
    const processes = commaSeparatedProcesses.split(',');
    const filteredFinalProcesses: IProcesses[] = [];
    const filteredNewProcesses = processes.reduce((finalProcess: IProcesses[], currentProcess: string) => {
        if (!finalProcess.some((process: IProcesses) => process.name === currentProcess)) {
            if (!validateProcessName(currentProcess.trim()))
                filteredFinalProcesses.push({
                    name: currentProcess.trim() || '',
                    isAllowed: true,
                });
            finalProcess.push({
                name: currentProcess.trim() || '',
                isAllowed: true,
                isInvalid: !!validateProcessName(currentProcess.trim()),
            });
        }
        return finalProcess;
    }, []);

    const kidProcesses = allProcesses.find((kid: IFilteredProcesses) => kid.id === selectedKidId);
    const processesToAdd = removeDuplicateProcesses(filteredFinalProcesses, kidProcesses?.processes || []);
    let nonFilteredProcesses = filterDuplicates(filteredNewProcesses, kidProcesses?.processes || []);
    return {
        id: kidProcesses?.id,
        name: kidProcesses?.name,
        processesToAdd,
        nonFilteredProcesses,
    };
};

const removeProcessItem = (selectedKidId: string, processName: string, websites: IFilteredProcesses[]) => {
    return websites.reduce((finalProcesses: IFilteredProcesses[], currentKidData: IFilteredProcesses) => {
        if (currentKidData.id === selectedKidId) {
            const processes: IProcesses[] = currentKidData.processes.filter((process: IProcesses) => process.name !== processName);
            finalProcesses.push({
                id: currentKidData.id,
                name: currentKidData.name,
                processes,
            });
        } else finalProcesses.push(currentKidData);
        return finalProcesses;
    }, []);
};

export { addProcesses, removeProcessItem };

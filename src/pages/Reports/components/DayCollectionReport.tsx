import { useState } from 'react';
import Excel from 'exceljs';
import {
  CollectionReportFilterField,
  FilterInputs,
} from '../../../entries/reports/collection-report-filter';
import { useAppStore } from '../../../hooks/useAppStore';
import { getCurrentDate } from '../../../utils/currentDate';
import { createObjectWithoutEmptyValues } from '../../../utils/createObjectWithoutEmptyValues';
import { getDayCollectionReport } from '../../../api/reports/getCollectionReport';
import { toastMessage } from '../../../components/toastMessage';
import { REPORT_DOWNLOAD_ERROR, REPORT_NAME, XLSX_EXT, XLSX_TYPE } from '../../../api/auth/constants';
import { CollectionReport } from '../../../entries/reports/collection-report';
import CheckboxOne from '../../../components/CheckboxOne';
import { ChevronDownIcon, FolderArrowDownIcon, XCircleIcon } from '@heroicons/react/24/solid';
import ClipLoader from 'react-spinners/ClipLoader';


const DayCollectionReport = () => {

    const { store }: any = useAppStore();
  
    const centerOptions = store?.centerFilters;
    const today = getCurrentDate();
    const [isLoading, setIsLoading] = useState(false);
    const [fromDate, setFromDate] = useState<any>(today);
    const [toDate, setToDate] = useState<any>();
    const [selectedCenter, setSelectedCenter] = useState<any>(0);
    const [isDateRange, setIsDateRange] = useState(false);
  
  
  
    const [filter, setFilter] = useState<FilterInputs>({
      [CollectionReportFilterField.FromDate]: fromDate,
      [CollectionReportFilterField.ToDate]: '',
      [CollectionReportFilterField.Center]: null,
    });
  
    const columns = [
      { header: 'Date', key: 'date' },
      { header: 'Member Code', key: 'memberCode' },
      { header: 'Member Name', key: 'memberName' },
    ];
  
    
     const onSelectCenter = (event: any) => {
       const value = +event.target.value;
       if (value > 0) {
         setSelectedCenter(value);
         setFilter({
           ...filter,
           [CollectionReportFilterField.Center]: value,
         });
       }
     };
  
   
    const fetchDayCollections = async () => {
      setIsLoading(true)
      try {
        const filters = createObjectWithoutEmptyValues(filter);
  
        const params = {
          ...filters,
        };
        const result = await getDayCollectionReport(params);
        generateExcel(result)
  
      } catch (error: any) {
          toastMessage(
            REPORT_DOWNLOAD_ERROR,
            'error',
          );
      } finally {
        setIsLoading(false);
      }
    };
  
  
    const generateExcel = (records: CollectionReport[]) => {
      const workbook = new Excel.Workbook();
      const sheet = workbook.addWorksheet(REPORT_NAME.Day_Collections);
  
      sheet.columns = columns;
  
      records.map((item) => {
        sheet.addRow({
          date: item.date,
          memberCode: item.memberCode,
          memberName: item.memberName,
        });
      });
  
      workbook.xlsx.writeBuffer().then((data: any) => {
        const blob = new Blob([data], {
          type: XLSX_TYPE,
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = generateFileName();
        a.click();
        window.URL.revokeObjectURL(url);
      });
    };
  
    const generateFileName = ()=>{
      let fileName = `${REPORT_NAME.Day_Collections}-${fromDate}`;
      if(toDate){
        fileName += `-${toDate}`
      }
      if(selectedCenter >0){
        const center = centerOptions.find((x:any)=>+x.value === + selectedCenter)
        if(center){
          fileName += `-${center.name}`;
        }
      }
      return `${fileName}${XLSX_EXT}`; 
    }
  
  
    const onClearFilter = ()=> {
      setIsDateRange(false);
      setFromDate(today);
      setToDate('')
      setSelectedCenter(0);
      setFilter({
        [CollectionReportFilterField.FromDate]: today,
        [CollectionReportFilterField.ToDate]: null,
        [CollectionReportFilterField.Center]: null,
      });
    };
  

  return (
     <div className="flex flex-col  gap-6 xl:flex-row xl:items-center xl:justify-between rounded-sm border border-stroke bg-white px-5 sm:px-4 xl:col-span-8 py-4">
      <div className="flex items-start gap-4">
        <div>
          <input
            type="date"
            name="fromDate"
            value={fromDate}
            className="custom-input-date custom-input-date-1 w-full rounded border-[2px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            onChange={async (e) => {
              const dt = e.target.value;
              if (dt) {
                setFromDate(dt);
                setFilter({
                  ...filter,
                  [CollectionReportFilterField.FromDate]: dt,
                });
              }
            }}
            max={today}
          />
          <div className="mt-3">
            <CheckboxOne
              label="Date Range"
              isChecked={isDateRange}
              setIsChecked={(checked) => {
                if (!checked) setToDate('');
                setIsDateRange(checked);
              }}
            />
          </div>
        </div>

        <input
          type="date"
          name="toDate"
          value={toDate}
          disabled={!isDateRange}
          className="custom-input-date custom-input-date-2 w-full rounded border-[2px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          onKeyDown={(e) => {
            e.preventDefault();
          }}
          onChange={async (e) => {
            const dt = e.target.value;
            if (dt) {
              setToDate(dt);
              setFilter({
                ...filter,
                [CollectionReportFilterField.ToDate]: dt,
              });
            }
          }}
          min={fromDate ? fromDate : null}
        />

        <div className="relative inline-block">
          <select
            name="centers"
            id="centers"
            value={selectedCenter}
            onChange={onSelectCenter}
            style={{
              width: '220px',
              height: '45px',
            }}
            className="relative z-20 inline-flex appearance-none   pl-3 pr-8 text-black text-md  rounded border-[2px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          >
            <option value="">Select Center</option>
            {centerOptions.map((center: any, index: number) => {
              return (
                <option key={`center-opt-${index}`} value={center.value}>
                  {center.name}
                </option>
              );
            })}
          </select>
          <ChevronDownIcon className="w-5 absolute top-1/2 right-3 z-10 -translate-y-1/2 cursor-pointer" />
        </div>

        <div className="w-full lg:w-1/2 xl:w-1/4 mt-2">
          <FolderArrowDownIcon
            className="w-8 cursor-pointer text-primary"
            onClick={() => !isLoading && fetchDayCollections()}
          />
        </div>

        <div className="w-full lg:w-1/2 xl:w-1/4 mt-2">
          <XCircleIcon
            className="w-8 cursor-pointer text-base"
            onClick={onClearFilter}
          />
        </div>

        <div>
          <ClipLoader color="#D34053" loading={isLoading} size={40} />
        </div>
      </div>
      </div>
  );
};

export default DayCollectionReport;

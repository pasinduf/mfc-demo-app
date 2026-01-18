import { useEffect, useState } from 'react';
import { createObjectWithoutEmptyValues } from '../../utils/createObjectWithoutEmptyValues.ts';
import {
  getCurrentDate,
  getFirstDateOfCurrentWeek,
  getFirstDateOfLastWeek,
  getLastDateOfLastWeek,
  getFirstDateOfCurrentMonth,
  getDateString,
} from '../../utils/dateConvert.ts';
import Loader from '../../components/loader.tsx';
import { ShowError } from '../../components/ShowError/index.tsx';

import { ChevronDownIcon } from '@heroicons/react/24/solid';
import Breadcrumb from '../../components/Breadcrumb.tsx';
import CollectionCard from './components/collectionCard.tsx';
import { CollectionFilterField, FilterInputs } from '../../entries/collection/filter.ts';
import { CollectorCenterDto } from '../../entries/center/collector-center.ts';
import { CollectionHistoryDto } from '../../entries/collection/collection.ts';
import { getCenters } from '../../api/dashboard/collector/getCenters/index.ts';
import { getCollections } from '../../api/collection/getCollections/index.ts';

const Collections = () => {
  const today = getCurrentDate();

  const [fromDate, setFromDate] = useState<any>('');
  const [toDate, setToDate] = useState<any>('');


  const dateTypes = [
    { value: 1, name: 'Today' },
    { value: 2, name: 'Yesterday' },
    { value: 3, name: 'This Week' },
    { value: 4, name: 'Last Week' },
    { value: 5, name: 'This Month' },
    { value: 6, name: 'Custom' },
  ];

  const [selectedDateType, setSelectedDateType] = useState<any>(1);

  const [filter, setFilter] = useState<FilterInputs>({
    [CollectionFilterField.FromDate]: today,
    [CollectionFilterField.ToDate]: null,
    [CollectionFilterField.Center]: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [centers, setCenters] = useState<CollectorCenterDto[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<any>(0);
  const [data, setData] = useState<CollectionHistoryDto[]>([]);

  useEffect(() => {
    fetchCenters();
  }, []);


  const fetchCenters = async () => {
    try {
      const params = {
        type: 'weekly',
        date: null,
      };
      const result = await getCenters(params);
      setCenters(result);
    } catch (error: any) {
      setError(error?.response?.data?.statusCode || 400);
    }
  };

 const onSelectDateOption = (event: any) => {
   const value = +event.target.value;
   if (value > 0) {
     setSelectedDateType(value);
   }
 }


 const assignDateRange = () => {
  setFromDate('');
  setToDate('');
   switch (selectedDateType) {
     case 1:
       setFilter({
         ...filter,
         [CollectionFilterField.FromDate]: today,
         [CollectionFilterField.ToDate]: today,
       });
       break;

     case 2:
       const currentDate = new Date();
       const yesterday = new Date(currentDate);
       yesterday.setDate(currentDate.getDate() - 1);
       const fromDt = getDateString(yesterday);
       setFilter({
         ...filter,
         [CollectionFilterField.FromDate]: fromDt,
         [CollectionFilterField.ToDate]: fromDt,
       });
       break;

     case 3:
       const fwDt = getFirstDateOfCurrentWeek();
       setFilter({
         ...filter,
         [CollectionFilterField.FromDate]: fwDt,
         [CollectionFilterField.ToDate]: today,
       });
       break;

     case 4:
       const lswFDt = getFirstDateOfLastWeek();
       const lswTDt = getLastDateOfLastWeek();
       setFilter({
         ...filter,
         [CollectionFilterField.FromDate]: lswFDt,
         [CollectionFilterField.ToDate]: lswTDt,
       });
       break;

     case 5:
       const cmFDt = getFirstDateOfCurrentMonth();
       setFilter({
         ...filter,
         [CollectionFilterField.FromDate]: cmFDt,
         [CollectionFilterField.ToDate]: today,
       });
       break;

     default:
       setFilter({
         ...filter,
         [CollectionFilterField.FromDate]: today,
         [CollectionFilterField.ToDate]: today,
       });
       break;
   }
 };

  useEffect(()=>{
    if(selectedDateType > 0){
      assignDateRange();
    }
  },[selectedDateType])


   const onSelectCenter = (event: any) => {
     const value = +event.target.value;
     if (value > 0) {
       setSelectedCenter(value);
       setFilter({
          ...filter,
         [CollectionFilterField.Center]: value,
       });
     }
   };



 const onSearch = async ()=>{
   setIsLoading(true);
   try {
     const filters = createObjectWithoutEmptyValues(filter);
     const result = await getCollections(filters);
     setData(result);
   } catch (error: any) {
     setError(error?.response?.data?.statusCode || 400);
   } finally {
     setIsLoading(false);
   }
 }


 const onReset=()=>{
  setSelectedDateType(1);
  setFromDate('');
  setToDate('');
  setSelectedCenter(0);
    setFilter({
      [CollectionFilterField.FromDate] : today,
      [CollectionFilterField.ToDate]:null,
      [CollectionFilterField.Center]: null,
    });
   setData([])
 }


  return (
    <>
      <Breadcrumb pageName="Collections" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12">
          <div className="rounded-sm border border-stroke bg-white px-4 py-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-5">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center flex-wrap">
                <div className="relative w-full sm:w-[220px]">
                  <select
                    value={selectedDateType}
                    onChange={onSelectDateOption}
                    className="w-full appearance-none py-2 pl-3 pr-8 text-md rounded border-2 border-stroke bg-transparent font-medium outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                  >
                    {dateTypes.map((type, i) => (
                      <option key={i} value={type.value}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="w-5 absolute top-1/2 right-3 -translate-y-1/2" />
                </div>

                {selectedDateType === 6 && (
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <input
                      type="date"
                      value={fromDate}
                      max={today}
                      onKeyDown={(e) => e.preventDefault()}
                      onChange={(e) => {
                        const dt = e.target.value;
                        if (dt) {
                          setFromDate(dt);
                          setFilter({
                            ...filter,
                            [CollectionFilterField.FromDate]: getDateString(dt),
                          });
                        }
                      }}
                      className="w-full sm:w-40 py-2 px-3 rounded border-2 border-stroke bg-transparent font-medium outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                    />

                    <input
                      type="date"
                      value={toDate}
                      min={fromDate || undefined}
                      disabled={!fromDate}
                      onKeyDown={(e) => e.preventDefault()}
                      onChange={(e) => {
                        const dt = e.target.value;
                        if (dt) {
                          setToDate(dt);
                          setFilter({
                            ...filter,
                            [CollectionFilterField.ToDate]: getDateString(dt),
                          });
                        }
                      }}
                      className="w-full sm:w-40 py-2 px-3 rounded border-2 border-stroke bg-transparent font-medium outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center flex-wrap">
                <div className="relative w-full sm:w-[220px]">
                  <select
                    value={selectedCenter}
                    onChange={onSelectCenter}
                    className="w-full appearance-none py-2 pl-3 pr-8 rounded border-2 border-stroke bg-transparent font-medium outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                  >
                    <option value="">Select Center</option>
                    {centers.map((c, i) => (
                      <option key={i} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="w-5 absolute top-1/2 right-3 -translate-y-1/2" />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    onClick={onSearch}
                    className="w-full sm:w-auto rounded-full bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
                  >
                    Search
                  </button>

                  <button
                    onClick={onReset}
                    className="w-full sm:w-auto rounded-full bg-body py-2 px-6 font-medium text-white hover:bg-opacity-90"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            <div className="py-4">
              {isLoading && <Loader />}
              {!isLoading && error && <ShowError error={error} />}

              {!isLoading &&
                !error &&
                (data.length ? (
                  data.map((group, i) => (
                    <div key={i} className="mb-4">
                      <h4 className="text-md font-bold text-black dark:text-white">
                        {group.date}
                      </h4>

                      {group.collections.map((item, j) => (
                        <div key={j} className="px-1 sm:px-2">
                          <CollectionCard collection={item} />
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="w-full py-6 text-center text-gray-500">
                    No collections available
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Collections;

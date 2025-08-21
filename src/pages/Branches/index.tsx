import { useEffect, useState } from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import AddBranchModal from './component/AddBranchModal';
import Breadcrumb from '../../components/Breadcrumb';
import { getBranchList } from '../../api/branch/getBranchList';
import Button from '../../components/button';
import { Branch as BranchModel } from '../../entries/branch/branch';
import { deleteBranch } from '../../api/branch/deleteBranch';
import { toastMessage } from '../../components/toastMessage';
import { DEFAULT_ERROR_MESSAGE } from '../../api/const/message';
import Loader from '../../components/loader';
import { ShowError } from '../../components/ShowError';
import { useAuth } from '../../hooks/useAuth';
import { ADMIN } from '../../api/RBAC/userRoles';
import { useAppStore } from '../../hooks/useAppStore';
import { getFilterBranches } from '../../api/filters/getFilterBranches';
import { Add_Branch, Edit_Branch } from '../../api/RBAC/userAccess';

const Branch = () => {
  const { auth }: any = useAuth();
  const [branches, setBranches] = useState<BranchModel[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
   const { store, setStore }: any = useAppStore();

  useEffect(() => {
    fetchBranch();
  }, []);
  
  const fetchBranch = async () => {
    try {
      const result = await getBranchList();
      setBranches(result);
    } catch (error: any) {
      setError(error?.response?.data?.statusCode || 400);
    } finally {
      setIsLoading(false);
    }
  };
  
  const onRefresh = () => {
    selectedBranch && setSelectedBranch(null);
    fetchBranch();
    // dispatch(updateBranchFilter());
  };
  
  const onSelectBranch = (branch: BranchModel) => {
    setSelectedBranch(branch);
    setOpenAdd(true);
  };
  
  const onClose = () => {
    selectedBranch && setSelectedBranch(null);
    setOpenAdd(false);
  };
  
  const onDelete = async (id: number) => {
    try {
      await deleteBranch(id);
      onRefresh();
      const branchFilters = await getFilterBranches();
      setStore({
        ...store,
        branchFilters,
      });
      toastMessage('Branch successfully deleted', 'success', 'top-right');
    } catch (error: any) {
      toastMessage(
        (error as any)?.response?.data?.message || DEFAULT_ERROR_MESSAGE,
        'error',
      );
    }
  };
  
  
   const allowAdd = ()=>{
      return auth?.access?.includes(Add_Branch);
    }
  
    const allowEdit = () => {
        return auth?.access?.includes(Edit_Branch);
    };


  return (
    <>
      <Breadcrumb pageName="Branches" />
      {isLoading && <Loader />}
      {error && <ShowError error={error} />}

      {!error && !isLoading && (
        <>
          {allowAdd() && (
            <div className="mt-6 flex lg:w-full xl:w-auto xl:flex-grow xl:justify-end">
              <Button text="Add" onClick={() => setOpenAdd(true)} />
            </div>
          )}

          <div className="mt-2 rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto h-auto max-h-115 overflow-y-auto">
              <table className="w-full table-auto">
                <thead className="sticky top-0 z-10 bg-stroke dark:bg-meta-4 text-left">
                  <tr>
                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                      Code
                    </th>
                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                      Name
                    </th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                      Centers
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white"></th>
                  </tr>
                </thead>
                {branches && branches.length > 0 ? (
                  <tbody>
                    {branches.map((branch, index) => {
                      return (
                        <tr key={`branch-${index}`}>
                          <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="font-medium text-black dark:text-white">
                              {branch.code}
                            </h5>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {branch.name}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            {branch.centers &&
                              branch.centers.length > 0 &&
                              branch.centers.map((center, index) => {
                                return (
                                  <p
                                    key={`center-${index}`}
                                    className="inline-flex rounded-full bg-meta-1 bg-opacity-10 py-1 px-3 m-1 text-sm font-medium"
                                  >
                                    {center.name}
                                  </p>
                                );
                              })}
                          </td>
                          {allowEdit() && (
                            <td className="py-5 px-4">
                              <div className="flex items-center space-x-3.5">
                                <PencilSquareIcon
                                  className="w-6 cursor-pointer text-primary"
                                  onClick={() => onSelectBranch(branch)}
                                />
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                ) : (
                  <div className="w-40 py-4">No data available</div>
                )}
              </table>
            </div>
          </div>

          {openAdd && (
            <AddBranchModal
              open={openAdd}
              onClose={onClose}
              onRefresh={onRefresh}
              branch={selectedBranch}
            />
          )}
        </>
      )}
    </>
  );
};

export default Branch;

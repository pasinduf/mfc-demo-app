import { useState } from 'react';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import { UserIcon } from '@heroicons/react/24/solid';
import { Modal } from '../../../components/modal';
import Button from '../../../components/button';
import { User } from '../../../entries/user/user';
import { userRole } from '../../../api/RBAC/RBAC';
import { MultiselectDropdown } from '../../../components/MultiselectDropdown';
import { useAppStore } from '../../../hooks/useAppStore';

interface Props {
  user: User;
}

export const MoerInfo = ({ user }: Props) => {
  const { store }: any = useAppStore();
  const centerOptions = store?.centerFilters;

  const [open, setOpen] = useState<boolean>(false);
  const centers = user?.centers?.map((center) => {
    return { value: center.id, name: center.name };
  });

  return (
    <>
      <EllipsisHorizontalIcon
        className="w-6 cursor-pointer"
        onClick={() => setOpen(true)}
      />
      <Modal
        isOpen={open}
        setIsOpen={setOpen}
        title="More Info"
        content={
          <div>
            <div className="h-100 overflow-y-auto">
              <div className="mt-4 mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <div className="w-full sm:w-1/2">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-4.5 top-4">
                      <UserIcon className="w-4" />
                    </span>
                    <div className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                      {user.username}
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-1/2">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    EMP No
                  </label>

                  <div className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                    {user.empNumber}
                  </div>
                </div>
                
              </div>

              <div className="mt-4 mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <div className="w-full sm:w-1/2">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    First Name
                  </label>
                  <div className="relative">
                    <span className="absolute left-4.5 top-4">
                      <UserIcon className="w-4" />
                    </span>
                    <div className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                      {user.firstName}
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-1/2">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Last Name
                  </label>

                  <div className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                    {user.lastName}
                  </div>
                </div>
              </div>

              <div className="mt-4 mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <div className="w-full sm:w-1/2">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Role
                  </label>
                  <div className="relative">
                    <span className="absolute left-4.5 top-4">
                      <UserIcon className="w-4" />
                    </span>
                    <div className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                      {user.role?.name}
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-1/2">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Phone Number
                  </label>

                  <div className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                    {user.phoneNumber}
                  </div>
                </div>
              </div>

              <div className="mt-4 mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <div className="w-full sm:w-1/2">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    NIC
                  </label>
                  <div className="relative">
                    <span className="absolute left-4.5 top-4">
                      <UserIcon className="w-4" />
                    </span>
                    <div className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                      {user.nic}
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-1/2">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    DOB
                  </label>

                  <div className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                    {user.dob || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-black dark:text-white">
                  Address
                </label>
                <div className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                  {user.address || 'N/A'}
                </div>
              </div>

              {user?.role?.id == userRole.Collector && (
                <div className="mb-5.5">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Centers
                  </label>
                  <MultiselectDropdown
                    options={centerOptions}
                    selectedOptions={centers}
                    onSelectOptions={(values) => {}}
                    disabled
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-8 justify-end text-right">
              <Button text="Close" inverse onClick={() => setOpen(false)} />
            </div>
          </div>
        }
      />
    </>
  );
};

export default MoerInfo;

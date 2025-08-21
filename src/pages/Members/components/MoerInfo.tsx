import { useState } from 'react';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import { UserIcon } from '@heroicons/react/24/solid';
import { Modal } from '../../../components/modal';
import Button from '../../../components/button';
import { Member } from '../../../entries/member/member';

interface Props {
  member: Member;
}

export const MoerInfo = ({ member }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

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
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute left-4.5 top-4">
                      <UserIcon className="w-4" />
                    </span>
                    <div className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                      {member.firstName}
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-1/2">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Last Name
                  </label>

                  <div className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                    {member.lastName}
                  </div>
                </div>
              </div>

              <div className="mt-4 mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <div className="w-full sm:w-1/2">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-4.5 top-4">
                      <UserIcon className="w-4" />
                    </span>
                    <div className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                      {member.phoneNumber}
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-1/2">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Business Type
                  </label>

                  <div className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                    {member.businessType || 'N/A'}
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
                      {member.nic}
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-1/2">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    DOB
                  </label>

                  <div className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                    {member.dob || 'N/A'}
                  </div>
                </div>
              </div>

              <div className="mb-5.5">
                <label className="block text-sm font-medium text-black dark:text-white">
                  Address
                </label>
                <div className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                  {member.address || 'N/A'}
                </div>
              </div>

              <div className="border-b border-stroke py-2 px-6.5 dark:border-strokedark">
                <h3 className="text-center font-medium text-black dark:text-white">
                  Guardian Details
                </h3>
              </div>

              <div className="mt-4 mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <div className="w-full sm:w-1/2">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    First Name
                  </label>
                  <div className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                    {member.guarantor?.firstName}
                  </div>
                </div>
                <div className="w-full sm:w-1/2">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Last Name
                  </label>
                  <div className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                    {member.guarantor?.lastName}
                  </div>
                </div>
              </div>

              <div className="mt-4 mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <div className="w-full sm:w-1/2">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    NIC
                  </label>
                  <div className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                    {member.guarantor?.nic}
                  </div>
                </div>
                <div className="w-full sm:w-1/2">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Phone Number
                  </label>
                  <div className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                    {member.guarantor?.phoneNumber}
                  </div>
                </div>
              </div>

              <div className="mt-4 mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <div className="w-full sm:w-1/2">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Relationship
                  </label>
                  <div className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                    {member.guarantor?.relationship}
                  </div>
                </div>
              </div>
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

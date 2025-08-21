import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const PageNotFound = () => {
  return (
    <div className="flex items-center justify-center mt-16">
      <div className="relative mb-5.5 block w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/2 appearance-none rounded border-2 border-dashed border-meta-4 bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5">
        <div className="flex flex-col items-center justify-center space-y-3">
          <span className="flex h-32 w-32 items-center justify-center rounded-full border border-stroke bg-danger opacity-70 dark:border-strokedark dark:bg-boxdark">
            <ExclamationTriangleIcon className="w-20" />
          </span>
          <h3 className="font-medium text-black dark:text-white">
            Your request is incorrect
          </h3>
          <p className="mt-1.5 text-sm">Page not found</p>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;

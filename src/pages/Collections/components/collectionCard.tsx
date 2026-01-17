
import { CollectionDto } from '../../../entries/collection/collection';
import { getTime } from '../../../utils/dateFormatter';

interface Props {
  collection: CollectionDto;
}

const CollectionCard = ({ collection }: Props) => {
  return (
    <div className="border border-gray-200 p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mb-4 w-full">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <span className="text-sm text-gray-500 shrink-0 mt-1">
            {getTime(collection.createdDate)}
          </span>

          <h4 className="text-title-xsm text-black dark:text-white font-semibold break-words">
            {collection.loan.memberName}
          </h4>
        </div>

        {/* Amount (always right) */}
        <div className="text-right flex-shrink-0 sm:min-w-[120px]">
          <h4 className="text-title-xs text-black dark:text-white font-semibold">
            {Number(collection.amount).toFixed(2)}
          </h4>
        </div>
      </div>

      {/* Center Name (always below, left-aligned) */}
      <div className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300 break-words">
        {collection.loan.centerName}
      </div>
    </div>
  );
};

export default CollectionCard;

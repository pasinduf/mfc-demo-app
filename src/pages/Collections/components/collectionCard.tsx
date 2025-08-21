
import { CollectionDto } from '../../../entries/collection/collection';
import { getTime } from '../../../utils/getTime';


interface Props {
  collection: CollectionDto;
}

const CollectionCard = ({ collection }: Props) => {
  return (
    <>
      <div className="border border-gray-200 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mb-4">
        <div className="flex items-end justify-between">
          <span>{getTime(collection.createdDate)}</span>
          <div>
            <h4 className="text-title-xsm  text-black dark:text-white">
              {collection.loan.memberName}
            </h4>
          </div>

          <div>
            <h4 className="text-title-xs  text-black dark:text-white">
              {collection.amount}
            </h4>
          </div>

          <div className="flex items-end">
            <div className="text-sm font-medium">
              {collection.loan.centerName}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionCard;

import { PlusCircleIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon, ChevronUpIcon,ClipboardDocumentIcon } from '@heroicons/react/24/solid';
import { Badge } from '../../../components/Badge';
import { CollectorLoanDto } from '../../../entries/loan/collector-loan';
import { getDateByString } from '../../../utils/dateConvert';
import { Collection_STATUS_OPTIONS } from '../../../api/auth/constants';
import { getCollectionStatusType } from '../../../utils/getStatusType';

interface Props {
  type: string;
  loan: CollectorLoanDto;
  onExpand: (id: number) => void;
  openAddPayment: (loan: CollectorLoanDto) => void;
}

const LoanCard = ({ type, loan, onExpand,openAddPayment }: Props) => {

   const onCopyNumber = (text: string) => {
     navigator.clipboard.writeText(text);
   };

  return (
    <div className="border border-gray-200 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mb-4 w-full">
      {/* Header (name + center) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2">
        <h4 className="text-title-sm font-bold text-black dark:text-white">
          {`${loan.member?.firstName} ${loan.member?.lastName}`}
        </h4>
        <div className="text-title-sm font-bold text-black">{loan.center}</div>
      </div>

      {/* Member code + dates + action buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mt-2 gap-2">
        <div>
          <div className="text-title-sm text-black dark:text-white">
            {loan.member?.code}
          </div>
          <span className="text-sm font-medium block">
            {getDateByString(loan.startDate)} : {getDateByString(loan.endDate)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!loan.isDayEnd && type === 'daily' && !loan.isDailyCollected && (
            <PlusCircleIcon
              className="w-6 cursor-pointer"
              color="#3C50E0"
              onClick={() => openAddPayment(loan)}
            />
          )}
          {!loan.isDayEnd && type === 'daily' && loan.isDailyCollected && (
            <PencilSquareIcon
              className="w-6 cursor-pointer"
              color="#2E3A47"
              onClick={() => openAddPayment(loan)}
            />
          )}
        </div>
      </div>

      {/* Expand section */}
      <div
        className="flex gap-1 pt-2 cursor-pointer items-center"
        onClick={() => onExpand(loan.id)}
      >
        <div className="col-span-auto text-xs font-semibold text-form-input">
          {`See ${loan.expanded ? 'less' : 'more'}`}
        </div>
        {loan.expanded ? (
          <ChevronUpIcon className="w-4 h-5" />
        ) : (
          <ChevronDownIcon className="w-4 h-5" />
        )}
      </div>

      {loan.expanded && (
        <div className="mt-2 space-y-2">
          <div className="flex flex-col sm:flex-row items-start gap-2 px-2 text-xs font-bold">
            <span>Phone Num:</span>
            <div className="flex items-center gap-1">
              <span>{loan.member?.phoneNumber}</span>
              <ClipboardDocumentIcon
                className="w-4 h-5 cursor-pointer"
                onClick={() => onCopyNumber(loan.member?.phoneNumber)}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start gap-2 px-2 text-xs font-bold">
            <span>Address:</span>
            <span>{loan.member?.address}</span>
          </div>
        </div>
      )}

      {/* Loan details + status */}
      <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2">
        <div>
          <h4>
            <span className="font-bold">Loan Amount: </span>
            Rs.{Math.trunc(+loan.amount)}
          </h4>
          <span className="text-sm font-medium block">
            <span className="font-bold">Balance: </span>
            Rs.{Math.trunc(+loan.balance)}
          </span>
        </div>

        <div className="text-left sm:text-right mt-1">
          {type === 'daily' && (
            <div className="text-md font-bold mb-1">
              <span className="font-bold">Payment: </span>
              {loan.collection ? `Rs.${loan.collection.amount}` : 'N/A'}
            </div>
          )}

          {type === 'daily' ? (
            <Badge
              text={
                loan.isDailyCollected
                  ? Collection_STATUS_OPTIONS.Collected
                  : Collection_STATUS_OPTIONS.Pending
              }
              type={getCollectionStatusType(
                loan.isDailyCollected
                  ? Collection_STATUS_OPTIONS.Collected
                  : Collection_STATUS_OPTIONS.Pending,
              )}
            />
          ) : (
            <Badge type="success" text={loan.collectionDay} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanCard;

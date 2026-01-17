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
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        {/* Left side (name + center) */}
        <div className="min-w-0">
          <h4 className="text-title-sm font-bold text-black dark:text-white break-words">
            {`${loan.member?.firstName} ${loan.member?.lastName}`}
          </h4>
          <span className="text-sm font-medium block break-words">
            {loan.center}
          </span>
        </div>

        {/* Right side icon (fixed) */}
        <div className="shrink-0">
          {!loan.isDayEnd && type === 'daily' && !loan.isDailyCollected && (
            <PlusCircleIcon
              className="w-6 cursor-pointer"
              onClick={() => openAddPayment(loan)}
            />
          )}
          {!loan.isDayEnd && type === 'daily' && loan.isDailyCollected && (
            <PencilSquareIcon
              className="w-6 cursor-pointer"
              onClick={() => openAddPayment(loan)}
            />
          )}
        </div>
      </div>

      {/* Member + dates + buttons */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mt-2 gap-2">
        <div className="min-w-0">
          {/* <div className="text-title-sm text-black dark:text-white break-words">
            {loan.member?.code}
          </div> */}
          <span className="text-sm font-medium block break-words">
            {getDateByString(loan.startDate)} : {getDateByString(loan.endDate)}
          </span>
        </div>
      </div>

      {/* Expand */}
      <div
        className="flex gap-1 pt-1 cursor-pointer items-center"
        onClick={() => onExpand(loan.id)}
      >
        <div className="text-xs font-semibold">
          {`See ${loan.expanded ? 'less' : 'more'}`}
        </div>
        {loan.expanded ? (
          <ChevronUpIcon className="w-4 h-5" />
        ) : (
          <ChevronDownIcon className="w-4 h-5" />
        )}
      </div>

      {/* Expanded details */}
      {loan.expanded && (
        <div className="mt-2 px-2 text-xs font-bold">
          {/* Phone */}
          <div className="flex items-start">
            <span className="min-w-[80px]">Phone Num:</span>
            <div className="flex items-center gap-1 break-all flex-1">
              <span className="break-all">{loan.member?.phoneNumber}</span>
              <ClipboardDocumentIcon
                className="w-4 h-5 cursor-pointer shrink-0"
                onClick={() => onCopyNumber(loan.member?.phoneNumber)}
              />
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2">
            <span className="min-w-[80px]">Address:</span>
            <span className="break-all flex-1">{loan.member?.address}</span>
          </div>
        </div>
      )}

      {/* Loan + status */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        {/* Left side */}
        <div className="break-words">
          <h4>
            <span className="font-bold">Loan Amount: </span>
            Rs.{Math.trunc(+loan.amount)}
          </h4>
          <span className="text-sm font-medium block">
            <span className="font-bold">Balance: </span>
            Rs.{Math.trunc(+loan.balance)}
          </span>
        </div>

        {/* Right side */}
        <div className="flex flex-col sm:items-end w-full sm:w-auto">
          {/* Payment left-aligned on mobile */}
          {type === 'daily' && (
            <div className="text-md font-bold mb-1 text-left sm:text-right w-full sm:w-auto">
              <span className="font-bold">Payment: </span>
              {loan.collection ? `Rs.${loan.collection.amount}` : 'N/A'}
            </div>
          )}

          {/* Badge always right-aligned */}
          <div className="flex justify-end">
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
    </div>
  );
};

export default LoanCard;

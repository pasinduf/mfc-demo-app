import { ChevronLeftIcon } from '@heroicons/react/16/solid';
import { Link, useNavigate } from 'react-router-dom';
interface BreadcrumbProps {
  pageName: string;
  navigateBack?: string;
}
const Breadcrumb = ({ pageName, navigateBack }: BreadcrumbProps) => {
  const navigate = useNavigate();

  const onNavigateBack = () => navigate(`${navigateBack}`);
  return (
    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {navigateBack && (
          <ChevronLeftIcon
            className="w-8 cursor-pointer"
            onClick={onNavigateBack}
          />
        )}
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          {pageName}
        </h2>
      </div>

      <nav className="flex-grow text-right">
        <ol className="flex items-center gap-2 justify-end">
          <li>
            <Link to="/">Dashboard /</Link>
          </li>
          <li className="text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;

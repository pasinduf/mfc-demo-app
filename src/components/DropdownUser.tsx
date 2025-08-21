import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import User from '../images/user/user.png';
import { Modal } from './modal';
import Button from './button';
import { useAuth } from '../hooks/useAuth';
import { tokenRepository } from '../api';
import {
  UserIcon,
  ArrowLeftStartOnRectangleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/solid';
import { ROLES } from '../api/RBAC/userRoles';

const DropdownUser = () => {
  const { auth, setAuth }: any = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  const [isOpenLogOut, setOpenLogout] = useState(false);

  const isCollector =
      tokenRepository.getUserRole() == ROLES.COLLECTION_OFFICER;

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const onConfirmLogout = () => {
    setAuth({});
    tokenRepository.removeAccessAuth();
    navigate('/', { replace: false });
  };

  return (
    <div className="relative">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {auth?.username}
          </span>
          <span className="block text-xs">{auth?.roles?.[0]}</span>
        </span>

        <span className="h-12 w-12 rounded-full">
          <img src={User} alt="User" />
        </span>

        <svg
          className={`hidden fill-current sm:block ${
            dropdownOpen ? 'rotate-180' : ''
          }`}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
          dropdownOpen === true ? 'block' : 'hidden'
        }`}
      >
        <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-5 dark:border-strokedark">
          <li>
            <Link
              to="/profile"
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            >
              <UserIcon className="w-5" />
              My Profile
            </Link>
          </li>
        </ul>

        {isCollector && (
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-5 dark:border-strokedark">
            <li>
              <Link
                to="/collections"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <ChartBarIcon className="w-5" />
                Collections
              </Link>
            </li>
          </ul>
        )}
        <button
          className="flex items-center gap-3.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          onClick={() => setOpenLogout(true)}
        >
          <ArrowLeftStartOnRectangleIcon className="w-5" />
          Log Out
        </button>
      </div>
      {/* <!-- Dropdown End --> */}

      <Modal
        size="small"
        isOpen={isOpenLogOut}
        setIsOpen={setOpenLogout}
        title="Confirm Log Out"
        content={
          <div className="p-6  text-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Are you sure you want to log out?
            </h2>

            <div className="flex justify-center gap-3 mt-6">
              <Button text="Log Out" onClick={onConfirmLogout} />
              <Button
                text="Cancel"
                inverse
                className="bg-bodydark2"
                onClick={() => setOpenLogout(false)}
              />
            </div>
          </div>
        }
      />
    </div>
  );
};

export default DropdownUser;

import { useSelector } from 'react-redux'
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline'

const Header = ({ onMenuClick }) => {
  const { user } = useSelector((state) => state.auth)

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-secondary-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-secondary-700 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-secondary-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Search or breadcrumbs could go here */}
        <div className="flex flex-1"></div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notifications */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-secondary-400 hover:text-secondary-500"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-secondary-200"
            aria-hidden="true"
          />

          {/* Profile */}
          <div className="flex items-center gap-x-4">
            <div className="hidden lg:flex lg:flex-col lg:items-end lg:leading-6">
              <div className="text-sm font-semibold text-secondary-900">
                {user?.name || 'Admin User'}
              </div>
              <div className="text-xs text-secondary-500">
                {user?.email || 'admin@rareperfume.com'}
              </div>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {(user?.name || 'A').charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header 

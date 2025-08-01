import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { NavLink, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  HomeIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  PencilSquareIcon,
  DocumentTextIcon,
  CogIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { logout } from '../../store/slices/authSlice'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Products', href: '/products', icon: ShoppingBagIcon },
  { name: 'Orders', href: '/orders', icon: ClipboardDocumentListIcon },
  { name: 'Blog', href: '/blog', icon: PencilSquareIcon },
  {
    name: 'Content',
    icon: DocumentTextIcon,
    subItems: [
      { name: 'About Us', href: '/content/about' },
      { name: 'Contact', href: '/content/contact' },
      { name: 'Terms of Service', href: '/content/terms' },
      { name: 'Privacy Policy', href: '/content/privacy' },
    ],
  },
  { name: 'Settings', href: '/settings', icon: CogIcon },
]

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
  }

  const isActiveLink = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-secondary-200">
        <h1 className="text-2xl font-display font-bold text-primary-600">
          Rare Perfume
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-6 py-6">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  {item.subItems ? (
                    <div>
                      <div className="flex items-center px-2 py-2 text-sm font-medium text-secondary-600">
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </div>
                      <ul className="ml-8 space-y-1">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.name}>
                            <NavLink
                              to={subItem.href}
                              className={({ isActive }) =>
                                `group flex gap-x-3 rounded-md px-2 py-2 text-sm leading-6 font-medium transition-colors ${
                                  isActive
                                    ? 'bg-primary-50 text-primary-600'
                                    : 'text-secondary-600 hover:text-primary-600 hover:bg-secondary-50'
                                }`
                              }
                            >
                              {subItem.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        `group flex gap-x-3 rounded-md px-2 py-2 text-sm leading-6 font-medium transition-colors ${
                          isActive
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-secondary-600 hover:text-primary-600 hover:bg-secondary-50'
                        }`
                      }
                    >
                      <item.icon
                        className="h-5 w-5 shrink-0"
                        aria-hidden="true"
                      />
                      {item.name}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </li>

          {/* Logout */}
          <li className="mt-auto">
            <button
              onClick={handleLogout}
              className="group -mx-2 flex w-full gap-x-3 rounded-md px-2 py-2 text-sm leading-6 font-medium text-secondary-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <ArrowLeftOnRectangleIcon
                className="h-5 w-5 shrink-0"
                aria-hidden="true"
              />
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-secondary-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white">
                  <SidebarContent />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-secondary-200 bg-white">
          <SidebarContent />
        </div>
      </div>
    </>
  )
}

export default Sidebar 

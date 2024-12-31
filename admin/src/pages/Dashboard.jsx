import { useQuery } from '@tanstack/react-query'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import {
  DocumentDuplicateIcon,
  EnvelopeIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const projects = await getDocs(collection(db, 'projects'))
      const messages = await getDocs(collection(db, 'messages'))
      
      return {
        projects: projects.size,
        messages: messages.size,
      }
    },
  })

  const cards = [
    {
      name: 'Total Projects',
      value: stats?.projects || 0,
      icon: DocumentDuplicateIcon,
      href: '/projects',
      color: 'text-purple-600 bg-purple-100',
    },
    {
      name: 'Unread Messages',
      value: stats?.messages || 0,
      icon: EnvelopeIcon,
      href: '/contact',
      color: 'text-blue-600 bg-blue-100',
    },
    {
      name: 'Profile Views',
      value: '1.2K',
      icon: UserIcon,
      href: '/about',
      color: 'text-green-600 bg-green-100',
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className={`absolute rounded-md p-3 ${card.color}`}>
                <card.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {card.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
              <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link
                    to={card.href}
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    View details
                    <span className="sr-only"> {card.name} stats</span>
                  </Link>
                </div>
              </div>
            </dd>
          </div>
        ))}
      </dl>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="text-center text-sm text-gray-500">
              Activity feed coming soon...
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Navigation</h2>
        <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <Link
              to="/projects"
              className="text-[#f5f5f5] hover:text-[#646cff] transition-colors duration-200"
            >
              Projects Manager
            </Link>
            <Link
              to="/skills"
              className="text-[#f5f5f5] hover:text-[#646cff] transition-colors duration-200"
            >
              Skills Manager
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

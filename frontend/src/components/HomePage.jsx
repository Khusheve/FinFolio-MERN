import React, { useState } from 'react'
import {
  ChartBarIcon,
  UserIcon,
  ShieldCheckIcon,
  BellAlertIcon,
  AdjustmentsVerticalIcon,
  ChartPieIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Real-Time Market Data",
    description: "Live prices and instant updates for stocks and funds.",
    icon: ChartBarIcon,
  },
  {
    name: "Secure & Private",
    description: "Encrypted, privacy-first portfolio storage.",
    icon: ShieldCheckIcon,
  },
  {
    name: "Personalized Alerts",
    description: "Custom notifications for price changes and news.",
    icon: BellAlertIcon,
  },
  {
    name: "Smart Rebalancing",
    description: "Automated suggestions to keep your portfolio on track.",
    icon: AdjustmentsVerticalIcon,
  },
  {
    name: "Visual Analytics",
    description: "Beautiful charts and ROI breakdowns for every asset.",
    icon: ChartPieIcon,
  },
  {
    name: "Watchlist & Tracking",
    description: "Follow your favorite stocks and get instant updates.",
    icon: UserIcon,
  },
  {
    name: "Profit/Loss Insights",
    description: "Clear, actionable performance analytics.",
    icon: CurrencyDollarIcon,
  },
];

function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState("login");

  return (
    <div className="bg-gradient-to-br from-green-50 to-white min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <img src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png" alt="logo" className="w-8 h-8" />
          <span className="text-2xl font-bold text-green-600 tracking-tight">FinFolio</span>
        </div>
        <div className="hidden md:flex gap-8 text-gray-700 font-medium">
          <a href="#features" className="hover:text-green-600 transition">Features</a>
          <a href="#dashboard" className="hover:text-green-600 transition">Dashboard</a>
          <a href="#learn" className="hover:text-green-600 transition">Learn</a>
        </div>
        <div className="flex gap-4">
          <button
            className="px-4 py-2 rounded-md text-green-600 font-semibold hover:bg-green-50 transition"
            onClick={() => { setModalOpen(true); setModalTab("login"); }}
          >
            Login
          </button>
          <button
            className="px-4 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            onClick={() => { setModalOpen(true); setModalTab("signup"); }}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-20 max-w-6xl mx-auto w-full">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
            Invest. Track. <span className="text-green-600">Grow.</span>
          </h1>
          <p className="text-xl text-gray-700">
            Your all-in-one platform for smart investing. Analyze your portfolio, get real-time updates, and achieve your financial goals with ease.
          </p>
          <div className="flex gap-4 mt-6">
            <button
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              onClick={() => { setModalOpen(true); setModalTab("signup"); }}
            >
              Get Started
            </button>
            
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center mt-12 md:mt-0">
          <img
            src="https://dribbble.com/shots/3450863-Stock-Portfolio/attachments/3450863-Stock-Portfolio?mode=media"
            alt="Dashboard preview"
            className="w-full max-w-md rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 px-8 bg-gradient-to-r from-green-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-10 text-center">Key Features</h3>
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.name} className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition">
                <feature.icon className="h-10 w-10 text-green-600 mb-4" />
                <h4 className="text-lg font-semibold mb-2">{feature.name}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section id="dashboard" className="bg-white py-16 px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-4 text-gray-900">Your Portfolio at a Glance</h3>
            <ul className="space-y-4 text-lg text-gray-700">
              <li>• Total Value: <span className="font-bold text-green-600">$48,235.67</span></li>
              <li>• Today's Gain/Loss: <span className="font-bold text-green-500">+ $1,245.33</span></li>
              <li>• Asset Allocation: <span className="font-bold text-indigo-600">Stocks, ETFs, Mutual Funds</span></li>
              <li>• ROI: <span className="font-bold text-blue-600">12.4% (1Y)</span></li>
            </ul>
            <p className="mt-6 text-gray-500">
              Visualize your performance with interactive charts and get actionable insights at a glance.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="https://cdn.dribbble.com/userupload/12345789/file/original-portfolio-charts.png"
              alt="Portfolio charts"
              className="w-full max-w-md rounded-xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Educational Section */}
      <section id="learn" className="bg-gradient-to-r from-green-100 to-white py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Learn & Grow</h2>
          <p className="text-lg text-gray-600">
            New to investing? Explore our interactive guides, risk profiling tools, and educational resources to become a smarter investor.
          </p>
        </div>
      </section>

      {/* Trust & Testimonials */}
      <section className="bg-white py-10 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Trusted by thousands of investors</h3>
          <p className="text-gray-500 mb-4">“FinFolio helped me understand my investments and make better decisions. The UI is beautiful and easy to use!”</p>
          <div className="flex gap-4 justify-center">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="user" className="w-10 h-10 rounded-full" />
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="user" className="w-10 h-10 rounded-full" />
            <img src="https://randomuser.me/api/portraits/men/54.jpg" alt="user" className="w-10 h-10 rounded-full" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-10 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-8">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-green-400 text-xl">FinFolio</span>
            <span className="ml-2 text-gray-400">© 2025</span>
          </div>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-green-400">Privacy Policy</a>
            <a href="#terms" className="hover:text-green-400">Terms</a>
            <a href="#contact" className="hover:text-green-400">Contact</a>
          </div>
        </div>
      </footer>

      {/* Login/Signup Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md">
            <div className="flex justify-between mb-6">
              <button
                className={`font-semibold px-4 py-2 rounded ${modalTab === "login" ? "bg-green-100 text-green-700" : "text-gray-500"}`}
                onClick={() => setModalTab("login")}
              >
                Login
              </button>
              <button
                className={`font-semibold px-4 py-2 rounded ${modalTab === "signup" ? "bg-green-100 text-green-700" : "text-gray-500"}`}
                onClick={() => setModalTab("signup")}
              >
                Sign Up
              </button>
              <button
                className="ml-auto text-gray-400 hover:text-gray-700"
                onClick={() => setModalOpen(false)}
              >
                ×
              </button>
            </div>
            {modalTab === "login" ? (
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-200"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-200"
                />
                <button className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition">
                  Login
                </button>
                <p className="text-sm text-center text-gray-500 mt-2">
                  New to FinFolio?{" "}
                  <span
                    className="text-green-600 cursor-pointer"
                    onClick={() => setModalTab("signup")}
                  >
                    Create an account
                  </span>
                </p>
              </form>
            ) : (
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-200"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-200"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-200"
                />
                <button className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition">
                  Sign Up
                </button>
                <p className="text-sm text-center text-gray-500 mt-2">
                  Already have an account?{" "}
                  <span
                    className="text-green-600 cursor-pointer"
                    onClick={() => setModalTab("login")}
                  >
                    Login
                  </span>
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
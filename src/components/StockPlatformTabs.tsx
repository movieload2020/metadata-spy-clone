import { Image, Film, FileCode } from "lucide-react";

const stockPlatforms = [
  { id: "general", name: "General", icon: "🖼️" },
  { id: "adobe", name: "Adobe Stock", icon: "🅰️" },
  { id: "shutterstock", name: "Shutterstock", icon: "📷" },
  { id: "freepik", name: "Freepik", icon: "🎨" },
  { id: "getty", name: "Getty Images", icon: "📸" },
  { id: "istock", name: "iStock", icon: "📷" },
  { id: "dreamstime", name: "Dreamstime", icon: "💭" },
  { id: "vecteezy", name: "Vecteezy", icon: "✏️" },
];

interface StockPlatformTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const StockPlatformTabs = ({ activeTab, onTabChange }: StockPlatformTabsProps) => {
  return (
    <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-thin">
      {stockPlatforms.map((platform) => (
        <button
          key={platform.id}
          onClick={() => onTabChange(platform.id)}
          className={`stock-tab ${
            activeTab === platform.id ? "stock-tab-active" : "stock-tab-inactive"
          }`}
        >
          <span className="text-base">{platform.icon}</span>
          <span>{platform.name}</span>
        </button>
      ))}
    </div>
  );
};

export default StockPlatformTabs;

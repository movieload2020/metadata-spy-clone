import { useState } from "react";
import { Key, ChevronDown, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface GenerationControlsProps {
  settings: {
    batchSize: number;
    titleLength: number;
    descriptionLength: number;
    keywordsCount: number;
    maxDescWords: number;
    fileExtension: string;
    customPrompt: string;
    silhouette: boolean;
    whiteBg: boolean;
    transparentBg: boolean;
    useCustomPrompt: boolean;
  };
  onSettingsChange: (settings: any) => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

const GenerationControls = ({ settings, onSettingsChange, apiKey, onApiKeyChange }: GenerationControlsProps) => {
  const [activeTab, setActiveTab] = useState<"metadata" | "prompt">("metadata");
  const [advanceTitleExpanded, setAdvanceTitleExpanded] = useState(false);

  const updateSetting = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const getSliderFillPercentage = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const SliderControl = ({
    id,
    label,
    value,
    min,
    max,
    unit,
    onChange,
    description,
  }: {
    id: string;
    label: string;
    value: number;
    min: number;
    max: number;
    unit: string;
    onChange: (value: number) => void;
    description?: string;
  }) => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={id} className="text-sm font-medium text-muted-foreground">
          {label}
        </label>
        <span className="text-sm font-semibold text-foreground">
          {value} {unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="slider-custom w-full h-2 rounded-lg"
        style={{ "--fill-percentage": `${getSliderFillPercentage(value, min, max)}%` } as React.CSSProperties}
      />
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </div>
  );

  const ToggleControl = ({
    id,
    label,
    checked,
    onChange,
    tooltip,
  }: {
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    tooltip: string;
  }) => (
    <div className="flex justify-between items-center">
      <label htmlFor={id} className="text-sm text-muted-foreground flex items-center cursor-pointer">
        {label}
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="w-3.5 h-3.5 ml-1.5 text-muted-foreground/60" />
          </TooltipTrigger>
          <TooltipContent className="max-w-[200px]">
            <p className="text-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </label>
      <div className="toggle-switch">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label htmlFor={id} className="slider" />
      </div>
    </div>
  );

  return (
    <div className="panel p-4 sm:p-6 lg:sticky top-20 lg:max-h-[calc(100vh-104px)] lg:overflow-y-auto scrollbar-thin">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-foreground">Generation Controls</h2>
        <Dialog>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 bg-foreground text-background px-3 py-1.5 rounded-lg font-medium shadow-sm hover:bg-foreground/90 transition-colors text-sm">
              <Key className="w-4 h-4" />
              <span>API Key</span>
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage API Key</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">OpenAI API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => onApiKeyChange(e.target.value)}
                  placeholder="sk-..."
                />
                <p className="text-xs text-muted-foreground">
                  Your API key is stored locally and never sent to our servers.
                </p>
              </div>
              <Button className="w-full">Save API Key</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <div className="relative border-b border-border mb-6">
        <div className="flex gap-4">
          <button
            className={`py-2 px-1 font-medium transition-colors ${
              activeTab === "metadata" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("metadata")}
          >
            Metadata
          </button>
          <button
            className={`py-2 px-1 font-medium transition-colors ${
              activeTab === "prompt" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("prompt")}
          >
            Prompt
          </button>
        </div>
        <div
          className="tab-underline"
          style={{
            left: activeTab === "metadata" ? "0" : "96px",
            width: activeTab === "metadata" ? "72px" : "54px",
          }}
        />
      </div>

      {/* Metadata Tab */}
      {activeTab === "metadata" && (
        <div className="space-y-6 animate-fade-in">
          <SliderControl
            id="batch-size"
            label="Processing Batch Size"
            value={settings.batchSize}
            min={1}
            max={10}
            unit="Files"
            onChange={(v) => updateSetting("batchSize", v)}
            description="Number of images to process simultaneously."
          />

          <SliderControl
            id="title-length"
            label="Title Length"
            value={settings.titleLength}
            min={20}
            max={200}
            unit="Chars"
            onChange={(v) => updateSetting("titleLength", v)}
          />

          <SliderControl
            id="desc-length"
            label="Description Character Length"
            value={settings.descriptionLength}
            min={50}
            max={500}
            unit="Chars"
            onChange={(v) => updateSetting("descriptionLength", v)}
          />

          <SliderControl
            id="keywords-count"
            label="Keywords Count"
            value={settings.keywordsCount}
            min={5}
            max={50}
            unit="Keywords"
            onChange={(v) => updateSetting("keywordsCount", v)}
          />

          {/* Advance Title */}
          <div className="space-y-4">
            <button
              className="flex justify-between items-center w-full text-left"
              onClick={() => setAdvanceTitleExpanded(!advanceTitleExpanded)}
            >
              <span className="text-sm font-medium text-muted-foreground">Advance Title</span>
              <span className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1">
                {advanceTitleExpanded ? "Collapse" : "Expand"}
                <ChevronDown className={`w-4 h-4 transition-transform ${advanceTitleExpanded ? "rotate-180" : ""}`} />
              </span>
            </button>
            {advanceTitleExpanded && (
              <div className="pl-4 border-l-2 border-primary/30 space-y-3 animate-fade-in">
                <p className="text-xs text-muted-foreground">
                  Advanced title generation options coming soon...
                </p>
              </div>
            )}
          </div>

          {/* Custom Prompt */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground">Custom Prompt</label>
            <select
              value={settings.customPrompt}
              onChange={(e) => updateSetting("customPrompt", e.target.value)}
              className="w-full p-2.5 bg-secondary border border-border text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary"
            >
              <option value="default">Default (Recommended)</option>
              <option value="custom">Set Custom Prompt</option>
            </select>
          </div>

          {/* File Extension */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground">Change File extension</label>
            <select
              value={settings.fileExtension}
              onChange={(e) => updateSetting("fileExtension", e.target.value)}
              className="w-full p-2.5 bg-secondary border border-border text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary"
            >
              <option value="default">Default</option>
              <option value="jpg">jpg</option>
              <option value="jpeg">jpeg</option>
              <option value="png">png</option>
              <option value="svg">svg</option>
              <option value="eps">eps</option>
              <option value="ai">ai</option>
              <option value="mp4">mp4</option>
            </select>
          </div>

          {/* Theme Color */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">Theme Color:</label>
            <input
              type="color"
              defaultValue="#f05a27"
              className="w-8 h-8 rounded-full cursor-pointer border-0 p-0"
            />
          </div>
        </div>
      )}

      {/* Prompt Tab */}
      {activeTab === "prompt" && (
        <div className="space-y-6 animate-fade-in">
          <SliderControl
            id="desc-words"
            label="Max Description Words"
            value={settings.maxDescWords}
            min={10}
            max={100}
            unit=""
            onChange={(v) => updateSetting("maxDescWords", v)}
          />

          <div className="space-y-4 pt-4 border-t border-border">
            <ToggleControl
              id="silhouette"
              label="SILHOUETTE"
              checked={settings.silhouette}
              onChange={(v) => updateSetting("silhouette", v)}
              tooltip="Use this for silhouette-style images to improve their discoverability in marketplaces."
            />

            <ToggleControl
              id="white-bg"
              label="White Background"
              checked={settings.whiteBg}
              onChange={(v) => updateSetting("whiteBg", v)}
              tooltip="Optimize metadata for isolated objects on white background to improve their discoverability in search results."
            />

            <ToggleControl
              id="transparent-bg"
              label="Transparent Background"
              checked={settings.transparentBg}
              onChange={(v) => updateSetting("transparentBg", v)}
              tooltip="Optimize metadata for isolated objects on transparent background to improve their discoverability in search results."
            />

            <ToggleControl
              id="custom-prompt"
              label="CUSTOM PROMPT"
              checked={settings.useCustomPrompt}
              onChange={(v) => updateSetting("useCustomPrompt", v)}
              tooltip="Create your own custom prompt for AI-generated metadata. This will override the default prompts while still ensuring proper formatting and keyword count."
            />
          </div>
        </div>
      )}

      <div className="mt-6">
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default GenerationControls;

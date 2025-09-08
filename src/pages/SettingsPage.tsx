import { motion } from 'framer-motion';
import { Palette, Globe, Volume2, Zap, RotateCcw } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useSettings } from '../context/AppStateHooks';
import { AccessibleButton } from '../components/common/AccessibleButton';

const SettingsPage = () => {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSettings();

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme });
  };

  const handleLanguageChange = (language: 'en' | 'es' | 'fr' | 'de') => {
    updateSettings({ language });
  };

  const handleSoundToggle = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const handleAnimationsToggle = () => {
    updateSettings({ animationsEnabled: !settings.animationsEnabled });
  };

  const resetSettings = () => {
    updateSettings({
      theme: 'light',
      language: 'en',
      soundEnabled: true,
      animationsEnabled: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ⚙️ {t('navigation.settings')}
            </h1>
            <p className="text-lg text-gray-600">
              Customize your learning experience.
            </p>
          </div>

          <div className="space-y-6">
            {/* Theme Settings */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Palette className="w-6 h-6 text-primary-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Theme</h2>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {['light', 'dark', 'system'].map((theme) => (
                  <AccessibleButton
                    key={theme}
                    variant={settings.theme === theme ? 'primary' : 'secondary'}
                    onClick={() => handleThemeChange(theme as 'light' | 'dark' | 'system')}
                    className="capitalize"
                  >
                    {theme}
                  </AccessibleButton>
                ))}
              </div>
            </div>

            {/* Language Settings */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Globe className="w-6 h-6 text-primary-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Language</h2>
              </div>
              <select
                value={settings.language}
                onChange={(e) => handleLanguageChange(e.target.value as 'en' | 'es' | 'fr' | 'de')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>

            {/* Sound Settings */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Volume2 className="w-6 h-6 text-primary-600 mr-3" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Sound Effects</h2>
                    <p className="text-gray-600">Enable audio feedback</p>
                  </div>
                </div>
                <button
                  onClick={handleSoundToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.soundEnabled ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Animation Settings */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Zap className="w-6 h-6 text-primary-600 mr-3" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Animations</h2>
                    <p className="text-gray-600">Enable smooth transitions</p>
                  </div>
                </div>
                <button
                  onClick={handleAnimationsToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.animationsEnabled ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.animationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Reset Settings */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <RotateCcw className="w-6 h-6 text-red-600 mr-3" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Reset Settings</h2>
                    <p className="text-gray-600">Restore default configuration</p>
                  </div>
                </div>
                <AccessibleButton
                  variant="destructive"
                  onClick={resetSettings}
                >
                  Reset
                </AccessibleButton>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;

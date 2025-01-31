import React, { useState } from 'react';
import { SettingsSection } from './SettingsSection';
import { ProfileSettings } from './ProfileSettings';
import { PreferencesSettings } from './PreferencesSettings';
import { NotificationSettings } from './NotificationSettings';
import { SecuritySettings } from './SecuritySettings';
import { ExportSettings } from './ExportSettings';

export const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <SettingsSection
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      <div className="lg:col-span-3">
        {activeSection === 'profile' && <ProfileSettings />}
        {activeSection === 'preferences' && <PreferencesSettings />}
        {activeSection === 'notifications' && <NotificationSettings />}
        {activeSection === 'security' && <SecuritySettings />}
        {activeSection === 'export' && <ExportSettings />}
      </div>
    </div>
  );
};
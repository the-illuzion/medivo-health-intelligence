import { Avatar, Button, Icon, IconTile, Row, Section } from '../components/UI';
import { DeviceArt } from '../components/Illustrations';
import type { Page, Tone } from '../data/mock';
export function Profile({
  navigate,
  openSheet,
  name,
}: {
  navigate: (p: Page) => void;
  openSheet: (s: string) => void;
  name: string;
}) {
  const health = [
    ['Personal Information', 'Age, gender, location, etc.', 'user', 'blue'],
    ['Health Conditions', 'Add existing conditions', 'heartpulse', 'red'],
    ['Medications', 'Current medications', 'pill', 'green'],
    ['Allergies', 'Known allergies', 'file', 'blue'],
    ['Health Goals', 'Your wellness goals', 'target', 'red'],
    ['Lifestyle', 'Sleep, activity, diet, etc.', 'user', 'purple'],
  ];
  return (
    <div className="profile-page">
      <section className="card profile-card">
        <div className="profile-top">
          <Avatar male />
          <div>
            <h1>{name}</h1>
            <p>32 years · Male</p>
            <p>prateek@example.com</p>
          </div>
          <button className="edit-profile" onClick={() => openSheet('Edit Profile')}>
            <Icon name="edit" size={13} />
            Edit Profile
          </button>
        </div>
        <div className="profile-facts">
          {[
            ['user', 'Male', 'Gender'],
            ['calendar', 'Jan 12, 1992', 'Date of birth'],
            ['drop', 'O+', 'Blood group'],
            ['pin', 'Gurgaon, India', 'Location'],
          ].map(([icon, value, label]) => (
            <div key={label}>
              <Icon name={icon} size={17} />
              <span>
                <b>{value}</b>
                <small>{label}</small>
              </span>
            </div>
          ))}
        </div>
      </section>
      <div className="security-banner">
        <IconTile name="shield" tone="green" />
        <div>
          <b>Your health data is secure</b>
          <p>We use industry-standard encryption to keep your information private and safe.</p>
        </div>
        <button className="text-button" onClick={() => openSheet('Privacy & Permissions')}>
          Learn more
          <Icon name="arrow" size={13} />
        </button>
      </div>
      <Section
        title="Health Profile"
        action="View & Edit"
        onAction={() => openSheet('Personal Information')}
      >
        <div className="two-columns health-profile">
          {health.map(([title, description, icon, tone]) => (
            <Row
              key={title}
              title={title}
              description={description}
              icon={icon}
              tone={tone as Tone}
              onClick={() => openSheet(title)}
            />
          ))}
        </div>
      </Section>
      <Section
        title="Connected Devices"
        action="View All"
        onAction={() => navigate('devices')}
        className="card profile-section"
      >
        <p>Manage your wearables and health devices.</p>
        <div className="three-columns profile-devices">
          {['Apple Watch', 'Dexcom CGM', 'Withings BP'].map((d, i) => (
            <button
              className="card"
              key={d}
              onClick={() => navigate(i === 2 ? 'connect' : 'devices')}
            >
              <DeviceArt kind={i === 0 ? 'watch' : i === 1 ? 'cgm' : 'monitor'} />
              <div>
                <b>{d}</b>
                <small className={i < 2 ? 'positive' : 'muted'}>
                  ● {i < 2 ? 'Connected' : 'Not connected'}
                </small>
                <small>{i < 2 ? `Last sync: ${i === 0 ? 5 : 12} min ago` : 'Connect'}</small>
              </div>
            </button>
          ))}
        </div>
      </Section>
      <Section title="Health Records" className="card profile-section">
        <p>Connect your medical records, lab reports and prescriptions.</p>
        <div className="three-columns records">
          {[
            ['Lab Reports', 'lab', '2 connected'],
            ['Medical Records', 'file', '1 connected'],
            ['Prescriptions', 'pill', '1 connected'],
          ].map(([title, icon, sub]) => (
            <Row
              key={title}
              title={title}
              icon={icon}
              description={sub}
              onClick={() => openSheet(title)}
            />
          ))}
        </div>
      </Section>
      <Section title="Medication" className="card profile-section">
        <p>Keep your medication list up to date.</p>
        <div className="medication-row">
          <Row
            icon="pill"
            title="2 active medications"
            description="Last updated 2 weeks ago"
            onClick={() => openSheet('Medications')}
          />
          <button className="text-button" onClick={() => openSheet('Add Medication')}>
            <Icon name="plus" size={16} />
            Add Medication
          </button>
        </div>
      </Section>
      <Section
        title="Care Network"
        action="View All"
        onAction={() => openSheet('Care Network')}
        className="card profile-section"
      >
        <p>Family, caregivers and healthcare providers.</p>
        <div className="three-columns network-cards">
          {['Rahul Sharma', 'Dr. Neha Verma', 'Add Member'].map((n, i) => (
            <button className="card" key={n} onClick={() => openSheet(i === 2 ? 'Add Member' : n)}>
              {i === 2 ? <IconTile name="plus" /> : <Avatar male={i === 0} />}
              <div>
                <b>{n}</b>
                <small>
                  {['Family Member', 'Primary Physician', 'Family, caregiver or clinician'][i]}
                </small>
                {i !== 2 && <small className="positive">● Active</small>}
              </div>
            </button>
          ))}
        </div>
      </Section>
      <Section
        title="Integrations"
        action="Manage"
        onAction={() => navigate('devices')}
        className="card profile-section"
      >
        <p>Sync with other health and lifestyle apps</p>
        <div className="two-columns integration-cards">
          {['Google Fit', 'MyFitnessPal'].map((s, i) => (
            <div className="card" key={s}>
              <IconTile name={i === 0 ? 'heart' : 'activity'} tone={i === 0 ? 'green' : 'blue'} />
              <span>
                <b>{s}</b>
                <small>Not connected</small>
              </span>
              <button className="text-button" onClick={() => openSheet(`choose:${s}`)}>
                Connect
              </button>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Account & Preferences">
        <Row
          icon="shield"
          title="Privacy & Permissions"
          description="Control your data, privacy settings and app permissions."
          onClick={() => openSheet('Privacy & Permissions')}
        />
        <Row
          icon="settings"
          title="Account Settings"
          description="App preferences, notifications and more."
          onClick={() => openSheet('Account Settings')}
        />
      </Section>
      <div className="support-banner">
        <IconTile name="help" />
        <div>
          <h3>Need Help?</h3>
          <p>Get support or view our help center</p>
        </div>
        <Button secondary onClick={() => openSheet('Need Help')}>
          Get Support
          <Icon name="arrow" size={14} />
        </Button>
      </div>
    </div>
  );
}

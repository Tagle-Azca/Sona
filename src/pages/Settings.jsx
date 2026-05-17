import { useState, useEffect } from 'react';
  import { getSettings, updateSettings } from '../services/mongoService';

  export default function Settings() {
    const [settings, setSettings] = useState(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
      getSettings().then(setSettings);
    }, []);

    const handleChange = (field, value) => {
      setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
      await updateSettings(settings._id, {
        language: settings.language,
        theme: settings.theme,
        favoriteChampions: settings.favoriteChampions,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    };

    if (!settings) return <p>Cargando settings...</p>;

    return (
      <div style={{ padding: '2rem' }}>
        <h1>Configuración de usuario</h1>

        <label>Idioma: </label>
        <select value={settings.language} onChange={e => handleChange('language', e.target.value)}>
          <option value="en">Inglés</option>
          <option value="es">Español</option>
          <option value="ko">Coreano</option>
        </select>

        <br /><br />

        <label>Tema: </label>
        <select value={settings.theme} onChange={e => handleChange('theme', e.target.value)}>
          <option value="dark">Oscuro</option>
          <option value="light">Claro</option>
        </select>

        <br /><br />

        <label>Campeones favoritos (separados por coma): </label>
        <input
          value={settings.favoriteChampions?.join(', ')}
          onChange={e => handleChange('favoriteChampions', e.target.value.split(',').map(s => s.trim()))}
        />

        <br /><br />

        <button onClick={handleSave}>Guardar</button>
        {saved && <span> ✓ Guardado</span>}
      </div>
    );
  }
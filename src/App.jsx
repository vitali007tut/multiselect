import './App.css';
import { useEffect, useState } from 'react';
import Multiselect from './Multiselect';

export default function App() {
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch('https://timeapi.io/api/timezone/availabletimezones');
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const zones = await res.json();
                const mapped = zones.map((z) => ({ label: z, value: z }));
                setOptions(mapped);
            } catch (e) {
                setError(e?.message ?? 'Failed to load');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return (
        <main className="p-4 rounded-xl bg-blue-50 w-lg mt-8">
            <h1 className="mb-6 text-2xl font-semibold">Multiselect — Timezones</h1>

            {loading && (
                <p className="text-slate-600">
                    Loading…
                </p>
            )}
            {error && <p className="text-red-600">Couldn't load the list: {error}</p>}

            {!loading && !error && (
                <>
                    <Multiselect
                        options={options}
                        selectedOptions={selected}
                        onSelectionChange={setSelected}
                        placeholder="Choose Timezones…"
                    />

                    <section className="mt-6">
                        {selected.length === 0 ? (
                            <p className="text-slate-600">Nothing is selected</p>
                        ) : (
                            <ul className="list-inside list-disc text-slate-800">
                                {selected.map((v) => (
                                    <li key={v}>{v}</li>
                                ))}
                            </ul>
                        )}
                    </section>
                </>
            )}
        </main>
    );
}

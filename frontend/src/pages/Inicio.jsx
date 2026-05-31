import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaShoppingCart, FaUsers, FaBoxOpen, FaDollarSign } from 'react-icons/fa';
import { FiTrendingUp } from 'react-icons/fi';

const Inicio = () => {
    const data = [
        { name: 'Ene', ventas: 45000 }, { name: 'Feb', ventas: 52000 },
        { name: 'Mar', ventas: 48000 }, { name: 'Abr', ventas: 61000 },
        { name: 'May', ventas: 58000 }, { name: 'Jun', ventas: 68000 },
    ];

    return (
        <div className="dashboard-content">
            <div className="cards-grid">
                <div className="stat-card">
                    <div className="card-icon-box"><FaDollarSign /></div>
                    <div className="card-title">Ventas Totales</div>
                    <div className="card-value">$67,450</div>
                    <div className="card-trend"><FiTrendingUp className="trend-up" /> <span className="trend-up">+12.5%</span> <span className="trend-text">vs mes anterior</span></div>
                </div>
                <div className="stat-card">
                    <div className="card-icon-box"><FaShoppingCart /></div>
                    <div className="card-title">Pedidos</div>
                    <div className="card-value">1,247</div>
                    <div className="card-trend"><FiTrendingUp className="trend-up" /> <span className="trend-up">+8.2%</span> <span className="trend-text">vs mes anterior</span></div>
                </div>
                <div className="stat-card">
                    <div className="card-icon-box"><FaUsers /></div>
                    <div className="card-title">Clientes Activos</div>
                    <div className="card-value">892</div>
                    <div className="card-trend"><FiTrendingUp className="trend-up" /> <span className="trend-up">+15.3%</span> <span className="trend-text">vs mes anterior</span></div>
                </div>
                <div className="stat-card">
                    <div className="card-icon-box"><FaBoxOpen /></div>
                    <div className="card-title">Productos</div>
                    <div className="card-value">156</div>
                    <div className="card-trend"><FiTrendingUp className="trend-up" /> <span className="trend-up">+3.8%</span> <span className="trend-text">vs mes anterior</span></div>
                </div>
            </div>

            <div className="chart-container">
                <h3 className="chart-title">Ventas Mensuales 2026</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888'}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#888'}} />
                            <Tooltip cursor={{fill: '#f5f5f5'}} />
                            <Bar dataKey="ventas" fill="#00b33c" radius={[4, 4, 0, 0]} barSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Inicio;
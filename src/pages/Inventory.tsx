import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Package, X } from 'lucide-react';
import { useData, InventoryItem } from '../context/DataContext';

const STATUS_COLORS = {
    available: 'bg-green-500/20 text-green-400 border-green-500/30',
    used: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    broken: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const TYPE_COLORS = {
    metal: 'bg-gray-500/20 text-gray-300',
    consumable: 'bg-yellow-500/20 text-yellow-400',
    sensors: 'bg-purple-500/20 text-purple-400',
    motors: 'bg-orange-500/20 text-orange-400',
    electronics: 'bg-blue-500/20 text-blue-400',
};

export default function Inventory() {
    const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useData();
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Mock current user role
    const currentUserRole = 'Coach';
    const canManageInventory = ['Coach', 'Adviser', 'Builder'].includes(currentUserRole);

    const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'>>({
        name: '',
        controlId: '',
        quantity: 1,
        status: 'available',
        type: 'metal',
    });

    const handleAddItem = () => {
        if (!canManageInventory) return;

        addInventoryItem(newItem);
        setShowAddModal(false);
        setNewItem({
            name: '',
            controlId: '',
            quantity: 1,
            status: 'available',
            type: 'metal',
        });
    };

    const handleUpdateItem = () => {
        if (!canManageInventory || !editingItem) return;

        updateInventoryItem(editingItem);
        setEditingItem(null);
    };

    const handleDeleteItem = (itemId: number) => {
        if (!canManageInventory) return;
        if (confirm('Are you sure you want to delete this item?')) {
            deleteInventoryItem(itemId);
            setEditingItem(null);
        }
    };

    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.controlId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || item.type === filterType;
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    const stats = {
        total: inventory.length,
        available: inventory.filter(i => i.status === 'available').length,
        used: inventory.filter(i => i.status === 'used').length,
        broken: inventory.filter(i => i.status === 'broken').length,
    };

    return (
        <div className="p-6 relative z-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Inventory Management</h1>
                        <p className="text-sm text-gray-400">Track and manage robotics parts and equipment</p>
                    </div>
                    {canManageInventory && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Item
                        </motion.button>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Total Items</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <Package className="w-8 h-8 text-gray-400" />
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Available</p>
                                <p className="text-2xl font-bold text-green-400">{stats.available}</p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">In Use</p>
                                <p className="text-2xl font-bold text-blue-400">{stats.used}</p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Broken</p>
                                <p className="text-2xl font-bold text-red-400">{stats.broken}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 mb-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or control ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                            />
                        </div>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                        >
                            <option value="all" className="bg-black">All Types</option>
                            <option value="metal" className="bg-black">Metal</option>
                            <option value="consumable" className="bg-black">Consumable</option>
                            <option value="sensors" className="bg-black">Sensors</option>
                            <option value="motors" className="bg-black">Motors</option>
                            <option value="electronics" className="bg-black">Electronics</option>
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                        >
                            <option value="all" className="bg-black">All Status</option>
                            <option value="available" className="bg-black">Available</option>
                            <option value="used" className="bg-black">Used</option>
                            <option value="broken" className="bg-black">Broken</option>
                        </select>
                    </div>
                </div>

                {/* Inventory Table */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Item Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Control ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                    {canManageInventory && (
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredInventory.map((item, index) => (
                                    <motion.tr
                                        key={item.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium">{item.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-400 font-mono">{item.controlId}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold">{item.quantity}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded ${TYPE_COLORS[item.type]}`}>
                                                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded border ${STATUS_COLORS[item.status]}`}>
                                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                            </span>
                                        </td>
                                        {canManageInventory && (
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setEditingItem(item)}
                                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => item.id && handleDeleteItem(item.id)}
                                                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredInventory.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No items found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Item Modal */}
            <AnimatePresence>
                {(showAddModal || editingItem) && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-black/90 border border-white/10 rounded-xl p-6 max-w-md w-full"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
                                <button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setEditingItem(null);
                                    }}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Item Name</label>
                                    <input
                                        type="text"
                                        value={editingItem ? editingItem.name : newItem.name}
                                        onChange={(e) => editingItem
                                            ? setEditingItem({ ...editingItem, name: e.target.value })
                                            : setNewItem({ ...newItem, name: e.target.value })
                                        }
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                                        placeholder="e.g., Aluminum C-Channel"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Control ID</label>
                                    <input
                                        type="text"
                                        value={editingItem ? editingItem.controlId : newItem.controlId}
                                        onChange={(e) => editingItem
                                            ? setEditingItem({ ...editingItem, controlId: e.target.value })
                                            : setNewItem({ ...newItem, controlId: e.target.value })
                                        }
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors font-mono"
                                        placeholder="e.g., MTL-001"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={editingItem ? editingItem.quantity : newItem.quantity}
                                        onChange={(e) => editingItem
                                            ? setEditingItem({ ...editingItem, quantity: parseInt(e.target.value) || 0 })
                                            : setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })
                                        }
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                                    <select
                                        value={editingItem ? editingItem.type : newItem.type}
                                        onChange={(e) => editingItem
                                            ? setEditingItem({ ...editingItem, type: e.target.value as any })
                                            : setNewItem({ ...newItem, type: e.target.value as any })
                                        }
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                                    >
                                        <option value="metal" className="bg-black">Metal</option>
                                        <option value="consumable" className="bg-black">Consumable</option>
                                        <option value="sensors" className="bg-black">Sensors</option>
                                        <option value="motors" className="bg-black">Motors</option>
                                        <option value="electronics" className="bg-black">Electronics</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                                    <select
                                        value={editingItem ? editingItem.status : newItem.status}
                                        onChange={(e) => editingItem
                                            ? setEditingItem({ ...editingItem, status: e.target.value as any })
                                            : setNewItem({ ...newItem, status: e.target.value as any })
                                        }
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
                                    >
                                        <option value="available" className="bg-black">Available</option>
                                        <option value="used" className="bg-black">Used</option>
                                        <option value="broken" className="bg-black">Broken</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    {editingItem && (
                                        <button
                                            onClick={() => editingItem.id && handleDeleteItem(editingItem.id)}
                                            className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setEditingItem(null);
                                        }}
                                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={editingItem ? handleUpdateItem : handleAddItem}
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-colors"
                                    >
                                        {editingItem ? 'Update' : 'Add'} Item
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api, { BASE_URL } from '../../services/api';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Plus, Search, Edit2, Trash2, X, Upload, Package, Image as ImageIcon, Tag } from 'lucide-react';
import ConfirmModal from '../../components/admin/common/ConfirmModal';
import styles from './ProductsPage.module.css';


const ProductsPage = () => {
    const { token } = useAdminAuth();
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [showCatManager, setShowCatManager] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const statusTabs = ['All', 'Active', 'Inactive'];

    const getImageUrl = (img) => {
        if (!img) return null;
        img = img.replace(/\\/g, '/');
        if (img.startsWith('http')) return img;
        const BASE = BASE_URL;
        return img.startsWith('/') ? `${BASE}${img}` : `${BASE}/${img}`;
    };

    // ─── Fetch Data ──────────────────────────────────────────────────────
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const res = await api.get('/api/products/admin/all', { headers });
            if (res.data.success) {
                setProducts(res.data.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch products', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('/api/categories');
            if (res.data.success) {
                setCategories(res.data.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch categories', err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();

        // Check for search query in URL
        const params = new URLSearchParams(location.search);
        const search = params.get('search');
        if (search) {
            setSearchQuery(search);
        }
    }, [token, location.search]);

    // ─── Filter Logic ────────────────────────────────────────────────────
    const filteredProducts = products.filter(p => {
        const matchesSearch = !searchQuery.trim() ||
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTab =
            activeTab === 'All' ||
            (activeTab === 'Active' && p.isActive) ||
            (activeTab === 'Inactive' && !p.isActive);

        return matchesSearch && matchesTab;
    });

    // ─── CRUD Handlers ───────────────────────────────────────────────────
    const handleSave = async (formData) => {
        try {
            setSaving(true);
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            };

            if (editingProduct) {
                await api.put(`/api/products/${editingProduct._id}`, formData, { headers });
            } else {
                await api.post('/api/products', formData, { headers });
            }

            setShowForm(false);
            setEditingProduct(null);
            fetchProducts();
        } catch (err) {
            console.error('Failed to save product', err);
            alert(err.response?.data?.message || 'Failed to save product');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            const headers = { Authorization: `Bearer ${token}` };
            await api.delete(`/api/products/${deleteTarget._id}`, { headers });
            setDeleteTarget(null);
            fetchProducts();
        } catch (err) {
            console.error('Failed to delete product', err);
        }
    };

    const openEdit = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const openAdd = () => {
        setEditingProduct(null);
        setShowForm(true);
    };

    // ─── Render ──────────────────────────────────────────────────────────
    return (
        <div className={`${styles.productsPage} admin-fade-in-up`}>
            <div className={styles.header}>
                <div className={styles.titleInfo}>
                    <h2>Products</h2>
                    <p>Manage your product catalog.</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.btnGlass} onClick={() => setShowCatManager(true)}>
                        <Tag size={18} />
                        Categories ({categories.length})
                    </button>
                    <button className={styles.btnPrimary} onClick={openAdd}>
                        <Plus size={18} />
                        Add Product
                    </button>
                </div>
            </div>

            <div className={styles.controls}>
                <div className={styles.searchWrap}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className={styles.tabs}>
                    {statusTabs.map(tab => (
                        <button
                            key={tab}
                            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.tableView}>
                {loading ? (
                    <div className={styles.loading}>Loading products...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Package size={48} />
                        <h3>No products found</h3>
                        <p>Try adjusting your search or add a new product.</p>
                    </div>
                ) : (
                    <>
                        {/* Table View (Desktop) */}
                        <div className={styles.tableCard}>
                            <table className={styles.productTable}>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map(product => (
                                        <tr key={product._id} onClick={() => openEdit(product)}>
                                            <td>
                                                <div className={styles.productCell}>
                                                    {product.images?.[0] ? (
                                                        <img
                                                            src={getImageUrl(product.images[0])}
                                                            alt={product.name}
                                                            className={styles.productThumb}
                                                            onMouseEnter={(e) => {
                                                                if (product.images[1]) e.target.src = getImageUrl(product.images[1]);
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.target.src = getImageUrl(product.images[0]);
                                                            }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setPreviewImage(e.target.src);
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className={styles.productThumb} style={{
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                        }}>
                                                            <ImageIcon size={18} style={{ color: 'var(--admin-text-muted)' }} />
                                                        </div>
                                                    )}
                                                    <div className={styles.productNameWrap}>
                                                        <span className={styles.productName}>{product.name}</span>
                                                        {product.brand && (
                                                            <span className={styles.productBrand}>{product.brand}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={styles.categoryBadge}>
                                                    {product.category?.name || '—'}
                                                </span>
                                            </td>
                                            <td className={styles.priceCell}>₹{product.price}</td>
                                            <td className={`${styles.stockCell} ${product.stock < 10 ? styles.stockLow : ''}`}>
                                                {product.stock}
                                            </td>
                                            <td>
                                                <span className={`${styles.statusBadge} ${product.isActive ? styles.statusActive : styles.statusInactive}`}>
                                                    <span className={styles.statusDot}></span>
                                                    {product.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className={styles.actionBtns}>
                                                    <button
                                                        className={styles.actionBtn}
                                                        onClick={(e) => { e.stopPropagation(); openEdit(product); }}
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                                        onClick={(e) => { e.stopPropagation(); setDeleteTarget(product); }}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Card View (Mobile) */}
                        <div className={styles.mobileProductGrid}>
                            {filteredProducts.map(product => (
                                <div 
                                    key={product._id} 
                                    className={styles.productCard}
                                    onClick={() => openEdit(product)}
                                >
                                    <div className={styles.cardHeader}>
                                        <div className={styles.cardThumbWrap}>
                                            {product.images?.[0] ? (
                                                <img 
                                                    src={getImageUrl(product.images[0])} 
                                                    alt={product.name} 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPreviewImage(getImageUrl(product.images[0]));
                                                    }}
                                                />
                                            ) : (
                                                <ImageIcon size={24} />
                                            )}
                                        </div>
                                        <div className={styles.cardTitleArea}>
                                            <h4>{product.name}</h4>
                                            <span className={styles.cardCategory}>{product.category?.name || 'No Category'}</span>
                                        </div>
                                        <div className={styles.cardStatus}>
                                            <span className={`${styles.statusDot} ${product.isActive ? styles.statusActiveDot : styles.statusInactiveDot}`}></span>
                                        </div>
                                    </div>
                                    <div className={styles.cardBody}>
                                        <div className={styles.cardStat}>
                                            <span className={styles.statLabel}>Price</span>
                                            <span className={styles.statValue}>₹{product.price}</span>
                                        </div>
                                        <div className={styles.cardStat}>
                                            <span className={styles.statLabel}>Stock</span>
                                            <span className={`${styles.statValue} ${product.stock < 10 ? styles.stockLow : ''}`}>{product.stock}</span>
                                        </div>
                                    </div>
                                    <div className={styles.cardActions} onClick={e => e.stopPropagation()}>
                                        <button onClick={() => openEdit(product)} className={styles.cardEditBtn}>
                                            <Edit2 size={16} /> Edit Details
                                        </button>
                                        <button onClick={() => setDeleteTarget(product)} className={styles.cardDeleteBtn}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* ─── Product Form Modal ──────────────────────────────────── */}
            {showForm && (
                <ProductFormModal
                    product={editingProduct}
                    categories={categories}
                    saving={saving}
                    onSave={handleSave}
                    onClose={() => { setShowForm(false); setEditingProduct(null); }}
                    getImageUrl={getImageUrl}
                    token={token}
                    fetchCategories={fetchCategories}
                />
            )}

            {/* ─── Category Manager Modal ─────────────────────────────── */}
            {showCatManager && (
                <CategoryManagerModal
                    categories={categories}
                    token={token}
                    fetchCategories={fetchCategories}
                    onClose={() => setShowCatManager(false)}
                />
            )}

            {/* ─── Delete Confirmation ─────────────────────────────────── */}
            <ConfirmModal
                isOpen={!!deleteTarget}
                title="Delete Product"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? This will permanently remove the product and cannot be undone.`}
                onConfirm={handleDelete}
                onClose={() => setDeleteTarget(null)}
                isDanger={true}
                confirmText="Delete"
            />

            {/* ─── Image Preview Modal ─────────────────────────────────── */}
            {previewImage && (
                <div className={styles.imagePreviewOverlay} onClick={() => setPreviewImage(null)}>
                    <div className={styles.imagePreviewContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.previewCloseBtn} onClick={() => setPreviewImage(null)}>
                            <X size={24} />
                        </button>
                        <img src={previewImage} alt="Preview" className={styles.previewImageLarge} />
                    </div>
                </div>
            )}
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// Product Form Modal Component
// ═══════════════════════════════════════════════════════════════════════════
const ProductFormModal = ({ product, categories, saving, onSave, onClose, getImageUrl, token, fetchCategories }) => {
    const fileInputRef = useRef(null);
    const [showAddCatInline, setShowAddCatInline] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [newCatDesc, setNewCatDesc] = useState('');
    const [creatingCat, setCreatingCat] = useState(false);
    const [catError, setCatError] = useState('');
    const [catSuccessMsg, setCatSuccessMsg] = useState('');
    const [form, setForm] = useState({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || '',
        category: product?.category?._id || product?.category || '',
        stock: product?.stock || 0,
        brand: product?.brand || '',
        tagline: product?.tagline || '',
        promoTitle: product?.promoTitle || '',
        promoContent: product?.promoContent || '',
        color: product?.color || '#f0f0f0',
        target: product?.target || [],
        features: product?.features || [],
        beforeText: product?.beforeText || '',
        afterText: product?.afterText || '',
        details: {
            benefits: product?.details?.benefits || [],
            ingredients: product?.details?.ingredients || [],
            beforeAfter: product?.details?.beforeAfter || [],
            usage: product?.details?.usage || [],
            faq: product?.details?.faq || [],
            other: product?.details?.other || [],
            legal: product?.details?.legal || [],
        },
        isActive: product?.isActive !== undefined ? product.isActive : true,
    });
    const [newFiles, setNewFiles] = useState([]);
    const [existingImages, setExistingImages] = useState(product?.images || []);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    // ─── List Field Helpers ──────────────────────────────────────────
    const addListItem = (field) => {
        setForm(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    };

    const updateListItem = (field, index, value) => {
        setForm(prev => {
            const arr = [...prev[field]];
            arr[index] = value;
            return { ...prev, [field]: arr };
        });
    };

    const removeListItem = (field, index) => {
        setForm(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index),
        }));
    };

    // ─── Nested Details Helpers ─────────────────────────────────────
    const addDetailItem = (section) => {
        setForm(prev => ({
            ...prev,
            details: {
                ...prev.details,
                [section]: [...prev.details[section], { id: Date.now().toString(), title: '', content: '' }]
            }
        }));
    };

    const updateDetailItem = (section, index, field, value) => {
        setForm(prev => {
            const arr = [...prev.details[section]];
            arr[index] = { ...arr[index], [field]: value };
            return {
                ...prev,
                details: { ...prev.details, [section]: arr }
            };
        });
    };

    const removeDetailItem = (section, index) => {
        setForm(prev => ({
            ...prev,
            details: {
                ...prev.details,
                [section]: prev.details[section].filter((_, i) => i !== index)
            }
        }));
    };

    // ─── Image Handling ──────────────────────────────────────────────
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setNewFiles(prev => [...prev, ...files]);
    };

    const removeNewFile = (index) => {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    // ─── Submit ──────────────────────────────────────────────────────
    const handleSubmit = (e) => {
        e.preventDefault();

        const fd = new FormData();
        fd.append('name', form.name);
        fd.append('description', form.description);
        fd.append('price', form.price);
        fd.append('category', form.category);
        fd.append('stock', form.stock);
        fd.append('brand', form.brand);
        fd.append('tagline', form.tagline);
        fd.append('promoTitle', form.promoTitle);
        fd.append('promoContent', form.promoContent);
        fd.append('color', form.color);
        fd.append('target', JSON.stringify(form.target.filter(Boolean)));
        fd.append('features', JSON.stringify(form.features.filter(Boolean)));
        fd.append('beforeText', form.beforeText);
        fd.append('afterText', form.afterText);
        fd.append('details', JSON.stringify(form.details));

        // pass existing images that weren't removed
        fd.append('existingImages', JSON.stringify(existingImages));
        fd.append('isActive', form.isActive);

        newFiles.forEach(file => {
            fd.append('images', file);
        });

        onSave(fd);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
                    <button className={styles.modalCloseBtn} onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.modalBody}>
                        <div className={styles.formGrid}>
                            {/* Name */}
                            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                                <label>Product Name *</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => handleChange('name', e.target.value)}
                                    placeholder="e.g. Ceramois™ – Ultra Nourishing Lotion"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                                <label>Description *</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => handleChange('description', e.target.value)}
                                    placeholder="Product description..."
                                    required
                                    rows={3}
                                />
                            </div>

                            {/* Price & Stock */}
                            <div className={styles.formGroup}>
                                <label>Price (₹) *</label>
                                <input
                                    type="number"
                                    value={form.price}
                                    onChange={e => handleChange('price', e.target.value)}
                                    placeholder="499"
                                    min="0"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Stock *</label>
                                <input
                                    type="number"
                                    value={form.stock}
                                    onChange={e => handleChange('stock', e.target.value)}
                                    placeholder="100"
                                    min="0"
                                    required
                                />
                            </div>

                            {/* Category & Brand */}
                            <div className={styles.formGroup}>
                                <div className={styles.labelWithAction}>
                                    <label>Category *</label>
                                    <button
                                        type="button"
                                        className={styles.addCategoryInlineBtn}
                                        onClick={() => setShowAddCatInline(!showAddCatInline)}
                                    >
                                        <Plus size={14} /> Add Category
                                    </button>
                                </div>

                                {catSuccessMsg && (
                                    <div className={styles.catSuccessText}>
                                        ✓ {catSuccessMsg}
                                    </div>
                                )}

                                {showAddCatInline && (
                                    <div className={styles.inlineCategoryForm}>
                                        <div className={styles.inlineCatTitle}>Add New Category</div>
                                        {catError && <div className={styles.catErrorText}>{catError}</div>}
                                        <div className={styles.inlineCatInputs}>
                                            <input
                                                type="text"
                                                placeholder="Category Name (e.g. Skin Care)"
                                                value={newCatName}
                                                onChange={e => setNewCatName(e.target.value)}
                                                className={styles.inlineCatInput}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Description (optional)"
                                                value={newCatDesc}
                                                onChange={e => setNewCatDesc(e.target.value)}
                                                className={styles.inlineCatInput}
                                            />
                                        </div>
                                        <div className={styles.inlineCatActions}>
                                            <button
                                                type="button"
                                                className={styles.btnSaveInlineCat}
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    if (!newCatName.trim()) {
                                                        setCatError('Category name is required');
                                                        return;
                                                    }
                                                    setCatError('');
                                                    setCreatingCat(true);
                                                    try {
                                                        const headers = token ? { Authorization: `Bearer ${token}` } : {};
                                                        const res = await api.post('/api/categories', { name: newCatName.trim(), description: newCatDesc.trim() }, { headers });
                                                        if (res.data.success) {
                                                            const newCat = res.data.data;
                                                            await fetchCategories();
                                                            setForm(prev => ({ ...prev, category: newCat._id }));
                                                            setNewCatName('');
                                                            setNewCatDesc('');
                                                            setShowAddCatInline(false);
                                                            setCatSuccessMsg(`Category "${newCat.name}" added and selected!`);
                                                            setTimeout(() => setCatSuccessMsg(''), 4000);
                                                        }
                                                    } catch (err) {
                                                        console.error('Failed to create category', err);
                                                        setCatError(err.response?.data?.message || 'Failed to create category');
                                                    } finally {
                                                        setCreatingCat(false);
                                                    }
                                                }}
                                                disabled={creatingCat}
                                            >
                                                {creatingCat ? 'Saving...' : 'Save & Select'}
                                            </button>
                                            <button
                                                type="button"
                                                className={styles.btnCancelInlineCat}
                                                onClick={() => { setShowAddCatInline(false); setCatError(''); }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <select
                                    value={categories.find(c => c._id === (typeof form.category === 'object' ? form.category._id : form.category) || c.name === form.category)?._id || (typeof form.category === 'object' ? form.category._id : form.category) || ''}
                                    onChange={e => handleChange('category', e.target.value)}
                                    required
                                >
                                    <option value="">Select category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Brand</label>
                                <input
                                    type="text"
                                    value={form.brand}
                                    onChange={e => handleChange('brand', e.target.value)}
                                    placeholder="Skin Care"
                                />
                            </div>

                            {/* Status */}
                            <div className={styles.formGroup}>
                                <label>Product Status</label>
                                <select
                                    value={form.isActive}
                                    onChange={e => handleChange('isActive', e.target.value === 'true')}
                                    required
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>

                            {/* Tagline & Color */}
                            <div className={styles.formGroup}>
                                <label>Tagline</label>
                                <input
                                    type="text"
                                    value={form.tagline}
                                    onChange={e => handleChange('tagline', e.target.value)}
                                    placeholder="Short product tagline"
                                />
                            </div>

                            {/* Promotional Text */}
                            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                                <h3 style={{ margin: '1rem 0 0.5rem', fontSize: '1rem' }}>Promotional Feature Snippet</h3>
                                <div className={styles.promoFieldsRow}>
                                    <div className={styles.formGroup} style={{ flex: 1 }}>
                                        <label>Promo Title</label>
                                        <input
                                            type="text"
                                            value={form.promoTitle}
                                            onChange={e => handleChange('promoTitle', e.target.value)}
                                            placeholder="e.g. Fights Acne & Acne Marks"
                                        />
                                    </div>
                                    <div className={styles.formGroup} style={{ flex: 2 }}>
                                        <label>Promo Content</label>
                                        <input
                                            type="text"
                                            value={form.promoContent}
                                            onChange={e => handleChange('promoContent', e.target.value)}
                                            placeholder="e.g. Clinically powered formula..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Card Color</label>
                                <div className={styles.colorInputWrap}>
                                    <input
                                        type="color"
                                        value={form.color}
                                        onChange={e => handleChange('color', e.target.value)}
                                        style={{ width: 40, height: 36, padding: 2, borderRadius: 8, cursor: 'pointer' }}
                                    />
                                    <input
                                        type="text"
                                        value={form.color}
                                        onChange={e => handleChange('color', e.target.value)}
                                        style={{ flex: 1 }}
                                    />
                                </div>
                            </div>

                            {/* Images */}
                            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                                <label>Product Images</label>
                                <div
                                    className={styles.imageUploadArea}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload size={24} />
                                    <p style={{ margin: '0.5rem 0 0' }}>Click to upload images (max 15)</p>
                                    <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>JPEG, PNG, WebP — 5MB each</p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />

                                <div className={styles.imagePreviewGrid}>
                                    {/* Existing images (edit mode) */}
                                    {existingImages.map((img, idx) => (
                                        <div key={`ex-${idx}`} className={styles.imagePreviewItem}>
                                            <img src={getImageUrl(img)} alt={`existing-${idx}`} />
                                            <button
                                                type="button"
                                                className={styles.imageRemoveBtn}
                                                onClick={() => removeExistingImage(idx)}
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    {/* New file previews */}
                                    {newFiles.map((file, idx) => (
                                        <div key={`new-${idx}`} className={styles.imagePreviewItem}>
                                            <img src={URL.createObjectURL(file)} alt={`new-${idx}`} />
                                            <button
                                                type="button"
                                                className={styles.imageRemoveBtn}
                                                onClick={() => removeNewFile(idx)}
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Features */}
                            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                                <label>Features</label>
                                <div className={styles.listInput}>
                                    {form.features.map((feat, idx) => (
                                        <div key={idx} className={styles.listInputRow}>
                                            <input
                                                value={feat}
                                                onChange={e => updateListItem('features', idx, e.target.value)}
                                                placeholder={`Feature ${idx + 1}`}
                                            />
                                            <button
                                                type="button"
                                                className={styles.listRemoveBtn}
                                                onClick={() => removeListItem('features', idx)}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" className={styles.listAddBtn} onClick={() => addListItem('features')}>
                                        <Plus size={14} /> Add Feature
                                    </button>
                                </div>
                            </div>

                            {/* Target */}
                            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                                <label>Suitability & Care Guide</label>
                                <div className={styles.listInput}>
                                    {form.target.map((t, idx) => (
                                        <div key={idx} className={styles.listInputRow}>
                                            <input
                                                value={t}
                                                onChange={e => updateListItem('target', idx, e.target.value)}
                                                placeholder={`Target ${idx + 1}`}
                                            />
                                            <button
                                                type="button"
                                                className={styles.listRemoveBtn}
                                                onClick={() => removeListItem('target', idx)}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" className={styles.listAddBtn} onClick={() => addListItem('target')}>
                                        <Plus size={14} /> Add Target
                                    </button>
                                </div>
                            </div>

                            {/* Before Text */}
                            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                                <label>Before Text</label>
                                <textarea
                                    value={form.beforeText}
                                    onChange={e => handleChange('beforeText', e.target.value)}
                                    placeholder="Text to display before product details..."
                                    rows={2}
                                />
                            </div>

                            {/* After Text */}
                            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                                <label>After Text</label>
                                <textarea
                                    value={form.afterText}
                                    onChange={e => handleChange('afterText', e.target.value)}
                                    placeholder="Text to display after product details..."
                                    rows={2}
                                />
                            </div>

                            {/* ─── Complex Details Section ─── */}
                            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                                <h3 className={styles.sectionHeader}>Product Details (Benefits, Usage, FAQ, etc.)</h3>
                                <div className={styles.detailsGrid}>
                                    {Object.entries(form.details).map(([section, items]) => (
                                        <div key={section} className={styles.detailSection}>
                                            <div className={styles.detailSectionHeader}>
                                                <label style={{ textTransform: 'capitalize' }}>{section.replace(/([A-Z])/g, ' $1')}</label>
                                                <button type="button" className={styles.listAddBtn} onClick={() => addDetailItem(section)}>
                                                    <Plus size={12} /> Add {section.slice(0, -1)}
                                                </button>
                                            </div>
                                            <div className={styles.nestedItems}>
                                                {items.map((item, idx) => (
                                                    <div key={`${section}-${idx}-${item.id || 'item'}`} className={styles.nestedItemRow}>
                                                        <div className={styles.nestedInputs}>
                                                            <input
                                                                value={item.title}
                                                                onChange={e => updateDetailItem(section, idx, 'title', e.target.value)}
                                                                placeholder="Title (e.g. How to use)"
                                                                className={styles.compactInput}
                                                            />
                                                            <textarea
                                                                value={item.content}
                                                                onChange={e => updateDetailItem(section, idx, 'content', e.target.value)}
                                                                placeholder="Content..."
                                                                className={styles.compactTextarea}
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className={styles.listRemoveBtn}
                                                            onClick={() => removeDetailItem(section, idx)}
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.modalFooter}>
                        <button type="button" className={styles.btnCancel} onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.btnSave} disabled={saving}>
                            {saving ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// Category Manager Modal Component
// ═══════════════════════════════════════════════════════════════════════════
const CategoryManagerModal = ({ categories, token, fetchCategories, onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Category name is required');
            return;
        }
        setError('');
        setSaving(true);
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            await api.post('/api/categories', { name: name.trim(), description: description.trim() }, { headers });
            setName('');
            setDescription('');
            await fetchCategories();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create category');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (catId) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        setDeletingId(catId);
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            await api.delete(`/api/categories/${catId}`, { headers });
            await fetchCategories();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete category');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} style={{ maxWidth: '550px' }} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Manage Categories</h2>
                    <button className={styles.modalCloseBtn} onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>
                <div className={styles.modalBody}>
                    <form onSubmit={handleCreate} className={styles.catManagerForm}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0, color: 'var(--admin-text-main)' }}>Add New Category</h3>
                        {error && <div className={styles.catErrorText}>{error}</div>}
                        <input
                            type="text"
                            placeholder="Category Name (e.g. Facial Cleanser)"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className={styles.inlineCatInput}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Description (optional)"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className={styles.inlineCatInput}
                        />
                        <button type="submit" className={styles.btnPrimary} style={{ alignSelf: 'flex-start' }} disabled={saving}>
                            <Plus size={16} />
                            {saving ? 'Creating...' : 'Add Category'}
                        </button>
                    </form>

                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--admin-text-main)' }}>Existing Categories ({categories.length})</h3>
                    <div className={styles.catList}>
                        {categories.length === 0 ? (
                            <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>No categories found.</p>
                        ) : (
                            categories.map(cat => (
                                <div key={cat._id} className={styles.catListItem}>
                                    <div className={styles.catInfo}>
                                        <span className={styles.catName}>{cat.name}</span>
                                        {cat.description && <span className={styles.catDesc}>{cat.description}</span>}
                                    </div>
                                    <button
                                        type="button"
                                        className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                        onClick={() => handleDelete(cat._id)}
                                        disabled={deletingId === cat._id}
                                        title="Delete Category"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;

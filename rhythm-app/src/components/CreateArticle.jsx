import { useState, useEffect } from 'react';
import { addUserArticle, updateArticle, addXP } from '../utils/dataStore';
import './CreateArticle.css';

const EMOJI_OPTIONS = ['📝', '🎸', '🎵', '🎶', '🎤', '🎼', '🤘', '🎯', '💡', '🔥', '⚡', '🌟', '🎻', '🥁', '🎹', '🎺'];
const COLOR_OPTIONS = ['#ff6b35', '#00ff9f', '#ff3366', '#6c5ce7', '#00cec9', '#fdcb6e', '#e17055', '#0984e3', '#d63031', '#00b894', '#e84393', '#2d3436'];

export default function CreateArticle({ user, onBack, onCreated, initialData }) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [shortDesc, setShortDesc] = useState(initialData?.shortDesc || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtubeUrl || '');
    const [icon, setIcon] = useState(initialData?.icon || '📝');
    const [color, setColor] = useState(initialData?.color || '#ff6b35');

    const canSubmit = title.trim() && shortDesc.trim() && content.trim();
    const isEditing = !!initialData;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!canSubmit) return;

        const articleData = {
            title: title.trim(),
            shortDesc: shortDesc.trim(),
            content: content.trim(),
            youtubeUrl: youtubeUrl.trim(),
            icon,
            color,
            author: initialData?.author || user.name || 'Anonim',
        };

        if (isEditing) {
            updateArticle(initialData.id, articleData);
            onCreated({ ...initialData, ...articleData }); // Return updated object
        } else {
            const article = addUserArticle(articleData);
            // Gamification: Add 100 XP only for new articles
            const result = addXP(100);
            if (result.leveledUp) {
                alert(`🎉 TEBRİKLER!\nSeviye Atladın: ${result.newLevel}`);
            }
            onCreated(article);
        }
    };

    return (
        <section className="create-article-page">
            <div className="create-article-container">

                <div className="create-article-header">
                    <span className="create-article-icon">{isEditing ? '✏️' : '✨'}</span>
                    <h1>{isEditing ? 'Makaleyi Düzenle' : 'Yeni Makale Oluştur'}</h1>
                    <p>{isEditing ? 'İçeriğini güncelle ve kaydet' : 'Bilgini toplulukla paylaş, gitar dünyasına katkıda bulun'}</p>
                </div>

                <form className="create-article-form" onSubmit={handleSubmit}>
                    {!user.name && (
                        <div className="guest-warning">
                            ⚠️ Giriş yapmadığınız için bu makaleyi daha sonra <strong>düzenleyemezsiniz</strong> veya <strong>silemezsiniz</strong>.
                        </div>
                    )}

                    {/* Title */}
                    <div className="form-group">
                        <label>📌 Makale Başlığı <span className="required">*</span></label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="ör: Barre Akor Geçişleri"
                            className="form-input"
                            maxLength={100}
                        />
                    </div>

                    {/* Short Description */}
                    <div className="form-group">
                        <label>📋 Kısa Açıklama <span className="required">*</span></label>
                        <input
                            type="text"
                            value={shortDesc}
                            onChange={(e) => setShortDesc(e.target.value)}
                            placeholder="Makale kartında görünecek kısa açıklama"
                            className="form-input"
                            maxLength={200}
                        />
                    </div>

                    {/* Icon Picker */}
                    <div className="form-group">
                        <label>🎨 İkon Seç</label>
                        <div className="picker-grid emoji-picker">
                            {EMOJI_OPTIONS.map((em) => (
                                <button
                                    key={em}
                                    type="button"
                                    className={`picker-item ${icon === em ? 'active' : ''}`}
                                    onClick={() => setIcon(em)}
                                >
                                    {em}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Picker */}
                    <div className="form-group">
                        <label>🎨 Renk Seç</label>
                        <div className="picker-grid color-picker">
                            {COLOR_OPTIONS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    className={`color-item ${color === c ? 'active' : ''}`}
                                    style={{ background: c }}
                                    onClick={() => setColor(c)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="form-group">
                        <label>📝 Makale İçeriği <span className="required">*</span></label>
                        <div className="content-hint">
                            💡 Başlıklar için <code>##</code>, alt başlıklar için <code>###</code>, listeler için <code>-</code> kullanabilirsiniz
                        </div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={`## Giriş\n\nBurada tekniğin ne olduğunu açıklayın...\n\n## Nasıl Yapılır?\n\n1. İlk adım\n2. İkinci adım\n\n## İpuçları\n\n- İpucu 1\n- İpucu 2`}
                            className="form-textarea"
                            rows={14}
                        />
                    </div>

                    {/* Preview Card */}
                    <div className="preview-section">
                        <h3>👁️ Önizleme</h3>
                        <div
                            className="preview-card"
                            style={{ '--card-accent': color }}
                        >
                            <div className="preview-accent" />
                            <div className="preview-body">
                                <span className="preview-icon">{icon}</span>
                                <h4>{title || 'Makale Başlığı'}</h4>
                                <p>{shortDesc || 'Kısa açıklama burada görünecek'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="submit-article-btn"
                        disabled={!canSubmit}
                    >
                        🚀 Makaleyi Yayınla
                    </button>
                </form>
            </div>
        </section>
    );
}

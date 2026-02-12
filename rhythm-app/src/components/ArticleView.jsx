import { useState, useEffect } from 'react';
import { getAllArticles, getCommentsByArticle, addComment, addReply, addXP, deleteArticle } from '../utils/dataStore';
import YouTubeEmbed from './YouTubeEmbed';
import './ArticleView.css';

export default function ArticleView({ articleId, isLoggedIn, username, onBack, onRequestLogin, onNavigate }) {
    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState([]);
    const [newRhythm, setNewRhythm] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        const all = getAllArticles();
        const found = all.find(a => a.id === articleId);
        if (found) {
            setArticle(found);
            setComments(getCommentsByArticle(found.id));
        }
    }, [articleId]);

    const handleDelete = () => {
        if (window.confirm('Bu makaleyi silmek istediğinize emin misiniz?')) {
            deleteArticle(article.id);
            onBack(); // Return to education page
        }
    };

    const handleEdit = () => {
        onNavigate('edit-article', { article: article });
    };

    const handleSubmitComment = (e) => {
        e.preventDefault();
        if (!newRhythm.trim() || !newMessage.trim()) return;

        const comment = addComment({
            articleId: article.id,
            author: username,
            rhythm: newRhythm.trim(),
            message: newMessage.trim(),
        });

        if (comment) {
            // Gamification: Add 10 XP
            const result = addXP(10);
            if (result.leveledUp) {
                alert(`🎉 TEBRİKLER!\nSeviye Atladın: ${result.newLevel}`);
            }

            setComments(getCommentsByArticle(article.id));
            setNewRhythm('');
            setNewMessage('');
        }
    };

    const handleSubmitReply = (commentId) => {
        if (!replyText.trim()) return;

        addReply(commentId, {
            author: username,
            message: replyText.trim(),
        });

        setComments(getCommentsByArticle(article.id));
        setReplyingTo(null);
        setReplyText('');
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Simple markdown-like rendering
    const renderContent = (text) => {
        const lines = text.split('\n');
        const elements = [];
        let inCodeBlock = false;
        let codeContent = '';

        lines.forEach((line, i) => {
            if (line.trim().startsWith('```')) {
                if (inCodeBlock) {
                    elements.push(
                        <pre key={`code-${i}`} className="article-code">
                            <code>{codeContent.trim()}</code>
                        </pre>
                    );
                    codeContent = '';
                    inCodeBlock = false;
                } else {
                    inCodeBlock = true;
                }
                return;
            }

            if (inCodeBlock) {
                codeContent += line + '\n';
                return;
            }

            const trimmed = line.trim();
            if (!trimmed) {
                elements.push(<br key={i} />);
            } else if (trimmed.startsWith('## ')) {
                elements.push(<h2 key={i} className="article-h2">{trimmed.slice(3)}</h2>);
            } else if (trimmed.startsWith('### ')) {
                elements.push(<h3 key={i} className="article-h3">{trimmed.slice(4)}</h3>);
            } else if (trimmed.match(/^\d+\.\s/)) {
                elements.push(<p key={i} className="article-list-item numbered">{trimmed}</p>);
            } else if (trimmed.startsWith('- ')) {
                elements.push(<p key={i} className="article-list-item">{trimmed}</p>);
            } else {
                elements.push(<p key={i} className="article-paragraph">{trimmed}</p>);
            }
        });

        return elements;
    };

    if (!article) return <div className="loading">Yükleniyor...</div>;

    return (
        <section className="article-page">
            <div className="article-container">

                {/* Article Content */}
                <article className="article-content" style={{ '--article-accent': article.color }}>
                    <div className="article-header-section">
                        <div className="article-header-top">
                            <span className="article-big-icon">{article.icon}</span>
                            {/* Author Actions */}
                            {username === article.author && (
                                <div className="author-actions">
                                    <button className="edit-btn" onClick={handleEdit}>✏️ Düzenle</button>
                                    <button className="delete-btn" onClick={handleDelete}>🗑️ Sil</button>
                                </div>
                            )}
                        </div>
                        <h1>{article.title}</h1>
                        <div className="article-meta-info">
                            <span>👤 {article.author}</span>
                            <span>📅 {new Date(article.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                    </div>

                    <div className="article-body">
                        {/* YouTube Embed */}
                        <YouTubeEmbed url={article.youtubeUrl} title={article.title} />

                        {renderContent(article.content)}
                    </div>
                </article>

                {/* Comments / Forum Section */}
                <div className="comments-section">
                    <div className="comments-header">
                        <h2>💬 Topluluk Yorumları</h2>
                        <span className="comment-count">{comments.length} yorum</span>
                    </div>

                    {/* New Comment Form */}
                    {isLoggedIn ? (
                        <form className="new-comment-form" onSubmit={handleSubmitComment}>
                            <div className="comment-form-header">
                                <span className="form-avatar">👤</span>
                                <span className="form-username">{username}</span>
                            </div>
                            <div className="form-field">
                                <label>🎵 Ritim Kalıbı <span className="required">*</span></label>
                                <input
                                    type="text"
                                    value={newRhythm}
                                    onChange={(e) => setNewRhythm(e.target.value)}
                                    placeholder="ör: ↓ ↓ ↑ ↓ ↑ veya D D U D U"
                                    className="rhythm-input"
                                />
                            </div>
                            <div className="form-field">
                                <label>✍️ Mesajınız <span className="required">*</span></label>
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Bu teknikle ilgili deneyiminizi paylaşın..."
                                    rows={3}
                                    className="message-input"
                                />
                            </div>
                            <button
                                type="submit"
                                className="submit-comment-btn"
                                disabled={!newRhythm.trim() || !newMessage.trim()}
                            >
                                Yorum Paylaş
                            </button>
                        </form>
                    ) : (
                        <div className="login-prompt">
                            <p>Yorum yazmak için giriş yapmanız gerekiyor.</p>
                            <button className="login-prompt-btn" onClick={onRequestLogin}>
                                Giriş Yap
                            </button>
                        </div>
                    )}

                    {/* Comments List */}
                    <div className="comments-list">
                        {comments.length === 0 ? (
                            <div className="no-comments">
                                <span>🎸</span>
                                <p>Henüz yorum yok. İlk yorumu siz yazın!</p>
                            </div>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="comment-thread">
                                    <div className="comment-item">
                                        <div className="comment-meta">
                                            <span className="comment-avatar">👤</span>
                                            <span className="comment-author">{comment.author}</span>
                                            <span className="comment-date">{formatDate(comment.createdAt)}</span>
                                        </div>
                                        <div className="comment-rhythm">
                                            <span className="rhythm-label">🎵 Ritim:</span>
                                            <span className="rhythm-value">{comment.rhythm}</span>
                                        </div>
                                        <p className="comment-message">{comment.message}</p>
                                        {isLoggedIn && (
                                            <button
                                                className="reply-btn"
                                                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                            >
                                                💬 Yanıtla
                                            </button>
                                        )}
                                    </div>

                                    {/* Replies */}
                                    {comment.replies && comment.replies.length > 0 && (
                                        <div className="replies-list">
                                            {comment.replies.map((reply) => (
                                                <div key={reply.id} className="reply-item">
                                                    <div className="comment-meta">
                                                        <span className="comment-avatar">👤</span>
                                                        <span className="comment-author">{reply.author}</span>
                                                        <span className="comment-date">{formatDate(reply.createdAt)}</span>
                                                    </div>
                                                    <p className="comment-message">{reply.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Reply Form */}
                                    {replyingTo === comment.id && (
                                        <div className="reply-form">
                                            <textarea
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder="Yanıtınızı yazın..."
                                                rows={2}
                                                className="reply-input"
                                                autoFocus
                                            />
                                            <div className="reply-actions">
                                                <button
                                                    className="cancel-reply-btn"
                                                    onClick={() => { setReplyingTo(null); setReplyText(''); }}
                                                >
                                                    İptal
                                                </button>
                                                <button
                                                    className="send-reply-btn"
                                                    onClick={() => handleSubmitReply(comment.id)}
                                                    disabled={!replyText.trim()}
                                                >
                                                    Gönder
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

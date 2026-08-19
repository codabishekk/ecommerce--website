import React, { useState } from 'react';
import api from '../../services/api';

const shortId = (id) => String(id || '').slice(-6).toUpperCase();

const ChatConfirm = ({ actionRequest, onComplete }) => {
    const [status, setStatus] = useState('idle'); // idle | processing | done | error | cancelled
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const order = actionRequest?.orderSummary;
    const actionLabel = {
        cancel_order: 'Cancel order',
        create_return_request: 'Return items',
        request_refund: 'Request refund',
    }[actionRequest?.action] || 'Confirm action';

    const handleConfirm = async () => {
        setStatus('processing');
        setError('');
        try {
            const { data } = await api.post('/api/ai/actions/confirm', {
                confirmationKey: actionRequest.confirmationKey,
            });
            setResult(data.data);
            setStatus('done');
            onComplete?.(data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Action could not be completed. Please try again.');
            setStatus('error');
        }
    };

    const handleCancel = () => {
        setStatus('cancelled');
        onComplete?.({ cancelled: true });
    };

    if (status === 'done' && result) {
        return <div className="ai-confirm ai-confirm-done">{result.message || 'Done.'}</div>;
    }
    if (status === 'cancelled') {
        return <div className="ai-confirm ai-confirm-cancelled">Action not performed.</div>;
    }

    return (
        <div className="ai-confirm">
            <div className="ai-confirm-title">{actionLabel}</div>
            {order && (
                <div className="ai-confirm-order">
                    <span>Order #{shortId(order.id)}</span>
                    <span>₹{order.totalPrice}</span>
                    <span>{order.orderStatus}</span>
                </div>
            )}
            {error && <div className="ai-confirm-error">{error}</div>}
            <div className="ai-confirm-actions">
                <button className="ai-btn ai-btn-primary" onClick={handleConfirm} disabled={status === 'processing'}>
                    {status === 'processing' ? 'Processing...' : 'Confirm'}
                </button>
                <button className="ai-btn ai-btn-ghost" onClick={handleCancel} disabled={status === 'processing'}>
                    Keep Order
                </button>
            </div>
        </div>
    );
};

export default ChatConfirm;

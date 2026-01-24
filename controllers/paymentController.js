const Transaction = require('../models/Transaction');

exports.handleNotification = async (req, res) => {
    try {
        const statusResponse = req.body;
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        console.log(`Transaction notification received. Order ID: ${orderId}. Status: ${transactionStatus}`);

        let updateStatus = '';

        if (transactionStatus == 'capture') {
            if (fraudStatus == 'challenge') updateStatus = 'pending';
            else if (fraudStatus == 'accept') updateStatus = 'settlement';
        } else if (transactionStatus == 'settlement') {
            updateStatus = 'settlement';
        } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
            updateStatus = 'cancel';
        } else if (transactionStatus == 'pending') {
            updateStatus = 'pending';
        }

        const transaction = await Transaction.findOneAndUpdate(
            { order_id: orderId },
            { 
                payment_status: updateStatus,
                $push: { payment_logs: { status_code: statusResponse.status_code, raw_response: statusResponse } }
            },
            { new: true }
        );

        res.status(200).send('OK');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
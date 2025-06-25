const Session = require('../models/Session');
const Question = require('../models/Question');

// @desc Create a new session
// @route POST /api/session/create
// @access Private
exports.createSession = async (req, res) => {
    try {
        const {role, experience, topicsForFocus, description, questions} = req.body;
        const userId = req.user._id;

        const session = await Session.create({
            user: userId,
            role,
            experience,
            topicsForFocus,
            description,
        })

        const questionDocs = await Promise.all(
            questions.map(async (q) => {
                const question = await Question.create({
                    session: session._id,
                    question: q.question,
                    answer: q.answer,
                });
                return question._id;
            })
        );
        session.questions = questionDocs;
        await session.save();

        res.status(201).json({success: true, session});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error creating session', error: error.message});
    }
};

// @desc Get session by ID
// @route GET /api/session/:id
// @access Private
exports.getSessionById = async (req, res) => {
    try {
       const session = await Session.findById(req.params.id)
            .populate({
                path: 'questions',
                options: {sort: {isPinned: -1, createdAt: -1}},
            })
            .exec();

        if (!session) {
            return res.status(404).json({success: false, message: 'Session not found'});
        }

        res.status(200).json({success: true, session}); 
    } catch (error) {
        res.status(500).json({success: false, message: 'Error creating session', error: error.message});
    }
}

// @desc Get all sessions for the authenticated user
// @route GET /api/session/my-sessions
// @access Private
exports.getMySessions = async (req, res) => {
    try {
        const sessions = await Session.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .populate('questions')
        res.status(200).json({success: true, sessions});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error creating session', error: error.message});
    }
}

// @desc Delete a session by ID
// @route DELETE /api/session/:id
// @access Private
exports.deleteSession = async (req,res) => {
    try {
        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({success: false, message: 'Session not found'});
        }

        // Check if the session belongs to the authenticated user
        if (session.user.toString() !== req.user.id) {
            return res.status(401).json({success: false, message: 'Not authorized to delete this session'});
        }

        // Delete all associated questions
        await Question.deleteMany({ session: session._id });

        // Delete the session
        await session.deleteOne();

        res.status(200).json({message: 'Session deleted successfully'});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error creating session', error: error.message});
    }
}
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { Endpoint, Question } = require('../models');

router.post('/', async (req, res, next) => {
    try {
        const {
            data = {},
            answer,
            question,
        } = req.body;

        let { 
            currentTags = [],
            excludedTags = [],
        } = data;

        if (answer) {
            if (answer.text === 'yes') { 
                currentTags.push(question.tag);
            } else if (answer.text === 'no') {
                excludedTags.push(question.tag);
            } else if (!answer.tag) {
                question.answers.forEach(ans => {
                    if (ans.tag) {
                    excludedTags.push(ans.tag);
                    }
                });
            } else {
                currentTags.push(answer.tag);
                question.answers.forEach(ans => {
                    if (ans.tag && ans.tag !== answer.tag) {
                    excludedTags.push(ans.tags);
                    }
                });
            }
        }
        let query = {};

        if (currentTags.length) {
            query.tags = { $all: currentTags };
        }

        if (excludedTags.length) {
            if (!query.tags) {
                query.tags = {};
            }
            query.tags.$not = { $all: excludedTags };
        }

        const endpoints = await Endpoint.find(query);
        const questions = await Question.find(currentTags.concat(excludedTags).length ? { tags: { $not: { $in: currentTags.concat(excludedTags) }}}: {});
        let minSplit = endpoints.length;
        let selectedQ;

        questions.forEach(q => {
            let maxSeq = 0;
            if (q.tags.length === 1) {
                const elems = endpoints.filter(endpoint => _.includes(endpoint.tags, q.tags[0])).length;
                maxSeq = Math.max(elems, endpoints.length - elems);
            } else {
                q.tags.forEach(qTag => {
                    if (!qTag) {
                        const elems = endpoints.filter(endpoint => endpoint.tags.length === _.difference(endpoint.tags, q.tags));
                        maxSeq = Math.max(maxSeq, elems, endpoints.length - elems);
                    } else {
                        const elems = endpoints.filter(endpoint => _.includes(endpoint.tags, q.tags)).length;
                        maxSeq = Math.max(maxSeq, elems, endpoints.length - elems);
                    }
                });
            }

            if (minSplit > maxSeq) {
                minSplit = maxSeq;
                selectedQ = q;
            }
        });

        if (minSplit === 0 || minSplit === endpoints.length) {
            return res.json({ data, endpoints, isFinished: true })
        }

        Object.assign(data, {
            currentTags,
            excludedTags,
        });

        return res.json({ data,  question: selectedQ });
    } catch (err) {
        console.log(err);
    }
});


module.exports = router;
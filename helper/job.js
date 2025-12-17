// const jobStatus = require("../enum/JobStatus");
// const jobType = require("../enum/JobType");

// const Job = require('../models/mssql/Job')

// const { initLogger } = require("../logger");
// const logger = initLogger('JobHelper')

// exports.createJobEmail = async (template, to, locals = {}) => {
//     const method = 'CreateEmail';
//     try {
//         const jsonData = {
//             template,
//             message:
//                 { to: "jarewat.janthadee.a8z@ap.denso.com" },
//             locals
//         }
//         const data = JSON.stringify(jsonData)
//         const job = await Job.create({
//             jobTypeId: jobType.Email,
//             data,
//             jobStatusId: jobStatus.Pending,
//         })
//         logger.info('Complete', { method, data: { jobId: job.jobId } })
//     } catch (error) {
//         logger.error(`Error ${error.message}`, { method });
//         throw error;
//     }
// }
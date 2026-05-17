import { JOB_STATUS } from "../../shared/constants/jobStatus"

export async function processSubmissionJob({ submissionId, formId, payload }) {
    // 1. Update DB: PROCESSING
    // await prisma.submission.update(...)

    // 2. Submit Google Form hoặc xử lý nghiệp vụ
    // await googleFormSubmitter.submit(formId, payload)

    // 3. Update DB: COMPLETED
    // await prisma.submission.update(...)

    return {
        submissionId,
        status: JOB_STATUS.COMPLETED,
    }
}
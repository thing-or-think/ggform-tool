import { formRepository } from '../modules/forms/form.repository.js'

async function test() {
    try {
        const result = await formRepository.upsertByUrl({
            formUrl: 'https://docs.google.com/forms/d/test',
            title: 'Test Form',
            provider: 'GOOGLE_FORM',
            fields: []
        })

        console.log('RESULT:', result)
    } catch (err) {
        console.error(err)
    }
}

test()
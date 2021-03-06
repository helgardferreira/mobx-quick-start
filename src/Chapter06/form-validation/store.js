import { action, configure, flow, observable, reaction } from 'mobx';
import { validate } from './validations';
import { enrollUser } from './service';

configure({ enforceActions: 'always' });

export class UserEnrollmentData {
    @observable email = '';
    @observable password = '';
    @observable firstName = '';
    @observable lastName = '';

    @observable validating = false;
    @observable.ref errors = null;

    @observable enrollmentStatus = 'none';

    disposeValidation = null;
    validateInterceptor = null;

    constructor() {
        this.setupValidation();
    }

    setupValidation() {
        this.disposeValidation = reaction(
            () => {
                const { firstName, lastName, password, email } = this;
                return { firstName, lastName, password, email };
            },
            fields => {
                if (this.validateInterceptor && this.validating) {
                    this.validateInterceptor.cancel();
                }

                this.validateInterceptor = this.validateFields(fields);
                this.validateInterceptor.catch(e => {
                    if (e.message !== 'FLOW_CANCELLED') {
                        throw e;
                    }
                });
            },
        );
    }

    @action
    setField(field, value) {
        this[field] = value;
    }

    getFields() {
        const { firstName, lastName, password, email } = this;
        return { firstName, lastName, password, email };
    }

    validateFields = flow(function*(fields) {
        this.validating = true;
        this.errors = null;

        try {
            yield validate(fields);

            this.errors = null;
        } catch (err) {
            this.errors = err;
        } finally {
            this.validating = false;
        }
    });

    enroll = flow(function*() {
        this.enrollmentStatus = 'pending';
        try {
            // Validation
            const fields = this.getFields();
            yield this.validateFields(fields);
            if (this.errors) {
                throw new Error('Invalid fields');
            }

            // Enrollment
            yield enrollUser(fields);

            this.enrollmentStatus = 'completed';
        } catch (e) {
            this.enrollmentStatus = 'failed';
        }
    });

    @action
    reset() {
        this.enrollmentStatus = 'none';
    }

    cleanup() {
        this.disposeValidation();
    }
}

configure({
    enforceActions: 'never',
});

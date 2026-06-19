import { useLocation } from "react-router-dom";
import { useForm } from "./useForm.js";
import { timeParts } from "./utilities/time.js";
import { setData } from "./utilities/firebase.js";

const isValidMeets = (meets) => {
    const parts = timeParts(meets);
    return (meets === '' || (parts.days && !isNaN(parts.hours?.start) && !isNaN(parts.hours?.end)));
};

const validateCourseData = (key, val) => {
    switch (key) {
        case 'title': return /(^$|\w\w)/.test(val) ? '': 'must be least two characters';
        case 'meets': return isValidMeets(val) ? '': 'must ve days hh:mm-hh:mm';
        default: return '';
    }
};


const EditForm = () => {
    const { state: course } = useLocation();

    const submit = async (values) => {
        console.log('values:', values);
        console.log('course:', course);
        if (window.confirm(`Change ${values.id} to ${values.title}: ${values.meets}`)) {
            try {
                await setData(`schedule/courses/${values.id}`,{
                    term: course.term,
                    number: course.number,
                    title: values.title,
                    meets: values.meets
                });
            } catch (error) {
                alert(error);
            } 
        }
    }

    const [errors, handleSubmit] = useForm(validateCourseData, submit)
    const hasErrors = errors && Object.values(errors).some(error => error !== '');

    return (
        <div className="container d-flex justify-content-center align-items-center py-5">
            <div className="card shadow border-0 rounded-4 p-4 p-sm-5 w-100" style={{maxWidth: '550px'}}>
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-dark mb-1">Edit Course</h2>
                    <p className="text-muted small">Update the course details below</p>
                </div>
                <form onSubmit={handleSubmit} noValidate className={hasErrors ? 'was-validated' : ''}>
                    <input type="hidden" name="id" value={course.id} />

                    {/* Input de titulo */}
                    <div className="mb-4">
                        <label htmlFor="title" className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">
                            Course Title
                        </label>
                        <input  
                            className="form-control form-control-lg bg-light border-0 rounded-3 text-dark fw-medium"
                            id="title"
                            name="title"
                            defaultValue={course.title}
                            required
                        />
                        <div className="invalid-feedback ps-1">{errors?.title}</div>
                    </div>

                    {/* Input de Horario */}
                    <div className="mb-4">
                        <label htmlFor="meets" className="form-label fw-semibold text-secondary small text-uppercase tracking-wider">
                            Meeting Time 
                        </label>
                        <input  
                            className="form-control form-control-lg bg-light border-0 rounded-3 text-dark fw-medium"
                            id="meets"
                            name="meets"
                            defaultValue={course.meets}
                            placeholder="e.g., MWF 11:00-11:50"
                            required
                        />
                        <div className="invalid-feedback ps-1">{errors?.meets}</div>
                    </div>

                    {/* Buttons */}
                    <div className="d-grid gap-2 pt-2">
                        <button type="submit" className="btn btn-primary btn-lg fw-bold rounded-3 shadow-sm py-2-5 fs-6">
                            Save Changes
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditForm;
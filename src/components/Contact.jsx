import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";

const fieldClass =
  "bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg border-none font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#915EFF] focus-visible:ring-offset-2 focus-visible:ring-offset-black-100";

const Contact = () => {
  const formRef = useRef();
  const fieldRefs = {
    name: useRef(null),
    email: useRef(null),
    message: useRef(null),
  };

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Enter your name so I know who is writing.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Enter your email so I can reply.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address, like jane@example.com.";
    }

    if (!form.message.trim()) {
      nextErrors.message = "Enter a message before sending.";
    }

    return nextErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    // Move focus to the first field that needs attention.
    const firstInvalid = ["name", "email", "message"].find(
      (field) => nextErrors[field]
    );

    if (firstInvalid) {
      setStatus("");
      fieldRefs[firstInvalid].current?.focus();
      return;
    }

    setLoading(true);
    setStatus("Sending your message…");

    emailjs
      .send(
        'service_2f15be2',
        'template_nyb91wf',
        {
          from_name: form.name,
          to_name: "Dylan",
          from_email: form.email,
          to_email: "dylnbtylr@gmail.com",
          message: form.message,
        },
        '46yGc7bo2WMem3Fy1'
      )
      .then(
        () => {
          setLoading(false);
          setStatus("Thank you. I will get back to you as soon as possible.");

          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          setLoading(false);
          console.error(error);

          setStatus(
            "Something went wrong and your message was not sent. Please try again, or email dylnbtylr@gmail.com directly."
          );
        }
      );
  };

  const renderError = (field) =>
    errors[field] ? (
      <span id={`${field}-error`} className='mt-2 text-[14px] text-[#ff9d9d]'>
        {errors[field]}
      </span>
    ) : null;

  return (
    <div
      className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}
    >
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className='flex-[0.75] bg-black-100 p-8 rounded-2xl'
      >
        <p className={styles.sectionSubText}>Get in touch</p>
        <h2 className={styles.sectionHeadText}>Contact.</h2>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className='mt-12 flex flex-col gap-8'
        >
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Your Name</span>
            <input
              ref={fieldRefs.name}
              type='text'
              name='name'
              autoComplete='name'
              value={form.name}
              onChange={handleChange}
              aria-invalid={errors.name ? "true" : undefined}
              aria-describedby={errors.name ? "name-error" : undefined}
              placeholder='e.g. Jane Doe'
              className={fieldClass}
            />
            {renderError("name")}
          </label>

          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Your Email</span>
            <input
              ref={fieldRefs.email}
              type='email'
              name='email'
              inputMode='email'
              autoComplete='email'
              spellCheck='false'
              autoCapitalize='none'
              value={form.email}
              onChange={handleChange}
              aria-invalid={errors.email ? "true" : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
              placeholder='e.g. jane@example.com'
              className={fieldClass}
            />
            {renderError("email")}
          </label>

          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Your Message</span>
            <textarea
              ref={fieldRefs.message}
              rows={7}
              name='message'
              autoComplete='off'
              value={form.message}
              onChange={handleChange}
              aria-invalid={errors.message ? "true" : undefined}
              aria-describedby={errors.message ? "message-error" : undefined}
              placeholder='Your message…'
              className={fieldClass}
            />
            {renderError("message")}
          </label>

          <button
            type='submit'
            disabled={loading}
            className='bg-tertiary py-3 px-8 rounded-xl w-fit text-white font-bold shadow-md shadow-primary touch-manipulation disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#915EFF] focus-visible:ring-offset-2 focus-visible:ring-offset-black-100'
          >
            {loading ? "Sending…" : "Send Message"}
          </button>

          <p aria-live='polite' className='text-white text-[14px] min-h-[20px]'>
            {status}
          </p>
        </form>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className='xl:flex-1 xl:h-auto md:h-[550px] h-[350px]'
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");

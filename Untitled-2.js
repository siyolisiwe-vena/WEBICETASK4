<!Form javascript> 
// ===== CONFIG: change these to match your storyline =====
const RECIPIENT = "info@yourorganisation.co.za";
const PRICES = { service: 250, sponsor: 1000 }; // rand per unit (service = per session, sponsor = per month)

// ===== Validation helpers =====
const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  phone: /^(\+27|0)[0-9]{9}$/
};

function setError(id, msg) {
  const el = document.getElementById(id + "Error");
  if (el) el.textContent = msg;
  const input = document.getElementById(id);
  if (input) input.classList.toggle("invalid", !!msg);
  return !msg;
}

function validateCommon() {
  let ok = true;
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim().replace(/\s/g, "");
  const type = document.getElementById("type").value;

  ok = setError("name", name.length >= 2 ? "" : "Please enter your full name (min 2 characters).") && ok;
  ok = setError("email", patterns.email.test(email) ? "" : "Please enter a valid email address.") && ok;
  ok = setError("phone", patterns.phone.test(phone) ? "" : "Enter a valid SA number, e.g. 0821234567 or +27821234567.") && ok;
  ok = setError("type", type ? "" : "Please select an option.") && ok;
  return ok;
}

// ===== Enquiry form =====
function initEnquiry() {
  const form = document.getElementById("enquiryForm");
  const type = document.getElementById("type");
  const qLabel = document.getElementById("quantityLabel");

  type.addEventListener("change", () => {
    const labels = { service: "Number of sessions *", volunteer: "Hours per week you can offer *", sponsor: "Number of months *" };
    qLabel.textContent = labels[type.value] || "Quantity *";
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    let ok = validateCommon();
    const qty = parseInt(document.getElementById("quantity").value, 10);
    ok = setError("quantity", qty >= 1 && qty <= 100 ? "" : "Enter a number between 1 and 100.") && ok;
    if (!ok) return;

    const name = document.getElementById("name").value.trim();
    const method = form.contact.value;
    let msg;
    if (type.value === "service") {
      const total = PRICES.service * qty;
      msg = `Thank you ${name}. ${qty} session(s) will cost R${total.toFixed(2)}. Sessions are available Monday to Friday, 08:00-16:00.`;
    } else if (type.value === "sponsor") {
      const total = PRICES.sponsor * qty;
      msg = `Thank you ${name}. Sponsoring for ${qty} month(s) is R${total.toFixed(2)} in total. A tax certificate is available on request.`;
    } else {
      msg = `Thank you ${name}. Volunteer spots are open for ${qty} hour(s) per week. Our coordinator will contact you to arrange an orientation session.`;
    }
    msg += ` We will follow up by ${method}.`;

    const box = document.getElementById("response");
    box.innerHTML = "<h2>Our response</h2><p></p>";
    box.querySelector("p").textContent = msg;
    box.hidden = false;
    box.scrollIntoView({ behavior: "smooth" });
  });
}

// ===== Contact form =====
function initContact() {
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", e => {
    e.preventDefault();
    let ok = validateCommon();
    const message = document.getElementById("message").value.trim();
    ok = setError("message", message.length >= 10 ? "" : "Message must be at least 10 characters.") && ok;
    if (!ok) return;

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const type = document.getElementById("type").value;

    const subject = `${type} from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nType: ${type}\n\nMessage:\n${message}`;

    document.getElementById("prevTo").textContent = RECIPIENT;
    document.getElementById("prevSubject").textContent = subject;
    document.getElementById("prevBody").textContent = body;
    document.getElementById("sendLink").href =
      `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const box = document.getElementById("emailPreview");
    box.hidden = false;
    box.scrollIntoView({ behavior: "smooth" });
  });
}
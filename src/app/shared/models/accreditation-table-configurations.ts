import {KeyValue} from './key-value';

export default class AccreditationTableConfigurations {

  static getAccreditationTable(accreditingBody: string): KeyValue[] {
    switch (accreditingBody) {
      case 'ACCME':
        return AccreditationTableConfigurations.ACCMETableContent;

      case 'JOINT ACCREDITATION':
        return AccreditationTableConfigurations.JointAccreditationTableContent;

      case 'AAFP':
        return AccreditationTableConfigurations.AafpAccreditationTableContent;

      case 'EACCME':
        return AccreditationTableConfigurations.EaccmeAccreditationTableContent;

      case 'ACGME':
        return AccreditationTableConfigurations.AcgmeAccreditationTableContent;

      case 'AOA':
        return AccreditationTableConfigurations.AoaAccreditationTableContent;

      case 'AAPA':
        return AccreditationTableConfigurations.AapaAccreditationTableContent;

      case 'ANCC':
        return AccreditationTableConfigurations.AnccAccreditationTableContent;

      case 'CAPCE':
        return AccreditationTableConfigurations.CapceAccreditationTableContent;

      case 'ACPE':
        return AccreditationTableConfigurations.acpeAccreditationTableContent;

      case 'OTHER ACCREDITOR':
        return AccreditationTableConfigurations.otherAccreditationTableContent;

      case 'INDEPENDENT':
        return AccreditationTableConfigurations.independentAccreditationTableContent;

      case 'NOT REQUIRED':
      default:
        //     if (this.certificationFormGroup.accreditedCertificate.value === 'false' && this.certificationFormGroup.providerCertificate.value === 'true') {
        // this.accreditationInfo = providerOnlyAccreditationInfo;
        //       this.certificationFormGroup.creditType.reset({value: 'other', disabled: true});
        return [];  // accreditationInfo

    }
  }

  static get ACCMETableContent() {
    return [
      this.optionC,
      this.optionD,
      this.optionE
    ];
  }

  static get JointAccreditationTableContent() {
    return [
      this.optionA,
      this.optionB
    ];
  }

  static get AafpAccreditationTableContent() {
    return [
      this.optionF
    ];
  }

  static get EaccmeAccreditationTableContent() {
    return [
      this.optionF2
    ];
  }

  static get AcgmeAccreditationTableContent() {
    return [
      this.optionG
    ];
  }

  static get AoaAccreditationTableContent() {
    return [
      this.optionH,
      this.optionI,
      this.optionI2,
      this.optionI3,
      this.optionI4
    ];
  }

  static get AapaAccreditationTableContent() {
    return [
      this.optionJ,
      this.optionK,
      this.optionL,
      this.optionM,
      this.optionN
    ];
  }

  static get AnccAccreditationTableContent() {
    return [
      this.optionO
    ];
  }

  static get acpeAccreditationTableContent() {
    return [
      this.optionQ
    ];
  }

  static get CapceAccreditationTableContent() {
    return [
      this.optionQ
    ];
  }

  static get otherAccreditationTableContent() {
    return [
      this.optionR
    ];
  }

  static get independentAccreditationTableContent() {
    return [
      this.optionS
    ];
  }

  static get optionA(): any {
    return {
      key: 'A',
      value: {
        label: '<p>Joint Accreditation: You are a jointly accredited interprofessional continuing education (CME/CE) provider recognized by the ACCME, ACPE and ANCC and <span class="bold">you are the sole provider</span> of this activity.</p> <p>Additional reading: <br/><a href="http://www.jointaccreditation.org/sites/default/files/Guide%20to%20the%20Joint%20Accreditation%20Process%20July%202017.pdf" target="_blank">http://www.jointaccreditation.org/sites/default/files/Guide%20to%20the%20Joint%20Accreditation%20Process%20July%202017.pdf</a></p>',
        template: '',
        creditTypeOptions: [
          {key: 'IPCE', value: {label: 'IPCE'}}
        ],
        accreditationStatement: [
          'In support of improving patient care, [providerName] is jointly accredited by the Accreditation Council for Continuing Medical Education (ACCME), the Accreditation Council for Pharmacy Education (ACPE), and the American Nurses Credentialing Center (ANCC), to provide continuing education for the healthcare team.'
        ],
        accreditationTooltip: [
          'The IPCE credit designation statement (below) is only used for activities that have been planned by and for the healthcare team. For activities that are focused on a single profession, for example, medicine, nursing, or pharmacy, jointly accredited providers will designate that appropriate credit (see below)'
        ],
        creditDesignationStatement: [
          '<div><strong>Credit Designation Statement – Health Team - IPCE</strong></div>',
          '<p>This activity was planned by and for the healthcare team, and learners will receive [creditNumber] Interprofessional Continuing Education (IPCE) credit(s) for learning and change.</p>',
          '<div><strong>Credit Designation Statement - Physicians</strong></div>',
          '<p>[providerName] designates this "[learningFormat]" activity for a maximum of [number] AMA PRA Category 1 Credits™. Physicians should claim only the credit commensurate with the extent of their participation in the activity.</p>',
          '<div><strong>AAPA Credit Acceptance Statement – Physician Assistants</strong></div>',
          '<p>AAPA accepts certificates of participation for educational activities certified for AMA PRA Category 1 Credit™ from organizations accredited by ACCME or a recognized state medical society. Physician assistants may receive a maximum of [creditNumber] hours of Category 1 credit(s) for completing this program.</p>',
          '<div><strong>AANP Credit Acceptance Statement – Nurse Practitioners</strong></div>',
          '<p>American Academy of Nurse Practitioners (AANP) accepts AMA PRA Category 1 Credit™ from organizations accredited by the ACCME.</p>',
          '<p><em>**AMA Credit must be claimed within 6 months of attendance. CME/CE will no longer be available to claim for this activity after six months of attending.</em></p>',
          '<div><strong>ANCC Credit Designation Statement - Nurses</strong></div>',
          '<p>The maximum number of hours awarded for this CE activity is [creditNumber] contact hours.</p>',
          '<p><em>**ANCC Credit must be claimed within 6 months of attendance. CME/CE will no longer be available to claim for this after six months of attending</em></p>'
        ],
        creditAcceptanceStatement: [
          'AAPA accepts certificates of participation for educational activities certified for AMA PRA Category 1 Credit™ from organizations accredited by ACCME or a recognized state medical society. Physician assistants may receive a maximum of [creditNumber] hours of Category 1 credit for completing this program.',
          'American Academy of Nurse Practitioners (AANP) accepts AMA PRA Category 1 Credit™ from organizations accredited by the ACCME.'
        ]
      }
    };
  }

  static get optionB(): any {
    return {
      key: 'B',
      value: {
        label: 'Joint Accreditation: You are a jointly accredited interprofessional continuing education (CME/CE) provider recognized by the ACCME, ACPE and ANCC and are <span class="bold">"jointly sponsoring" this activity with a non-accredited organization</span>.',
        template: '',
        creditTypeOptions: [
          {key: 'IPCE', value: {label: 'IPCE'}}
        ],
        accreditationStatement: [
          'In support of improving patient care, [coProvider] is jointly accredited by the Accreditation Council for Continuing Medical Education (ACCME), the Accreditation Council for Pharmacy Education (ACPE), and the American Nurses Credentialing Center (ANCC), to provide continuing education for the healthcare team.'
        ],
        creditDesignationStatement: [],
        creditAcceptanceStatement: []
      }
    };
  }

  static get optionC(): any {
    return {
      key: 'C',
      value: {
        label: '<p>You are an accredited continuing medical education (CME) provider recognized by the ACCME and <span class="bold">you are the sole provider</span> of this activity. Credit is awarded from the AMA PRA Credit System.</p>  <p>Additional reading: <br/> <a href="https://www.ama-assn.org/sites/default/files/media-browser/public/cme/pra-booklet_0.pdf" target="_blank">https://www.ama-assn.org/sites/default/files/media-browser/public/cme/pra-booklet_0.pdf</a></p>',
        template: '',
        creditTypeOptions: [
          {key: 'AMA-PRA-1', value: {label: 'AMA PRA Category 1 Credit(s)™'}},
          {key: 'AMA-PRA-2', value: {label: 'AMA PRA Category 2 Credit(s)™'}}
        ],
        accreditationStatement: [
          '[providerName] is accredited by the Accreditation Council for Continuing Medical Education (ACCME) to provide continuing medical education to physicians.'
        ],
        creditDesignationStatement: [
          '[providerName] designates this "[learningFormat]" activity for a maximum of [creditNumber] [creditType]. Physicians should claim only the credit commensurate with the extent of their participation in the activity.'
        ],
        creditAcceptanceStatement: []
      }
    };
  }

  static get optionD(): any {
    return {
      key: 'D',
      value: {
        label: '<p>You are an accredited continuing medical education (CME) provider recognized by the ACCME and are <span class="bold">"jointly sponsoring" this activity with a non-accredited organization</span>. Credit is awarded from the AMA PRA Credit System.</p>  <p>Additional reading: <br/> <a href="https://www.ama-assn.org/sites/default/files/media-browser/public/cme/pra-booklet_0.pdf" target="_blank">https://www.ama-assn.org/sites/default/files/media-browser/public/cme/pra-booklet_0.pdf</a></p>',
        template: '',
        creditTypeOptions: [
          {key: 'AMA-PRA-1', value: {label: 'AMA PRA Category 1 Credit(s)™'}},
          {key: 'AMA-PRA-2', value: {label: 'AMA PRA Category 2 Credit(s)™'}}
        ],
        accreditationStatement: [
          'This activity has been planned and implemented in accordance with the accreditation requirements and policies of the Accreditation Council for Continuing Medical Education (ACCME) through the joint providership of [providerName] and [coProvider]. [providerName] is accredited by the ACCME to provide continuing medical education for physicians. [providerName] designates this "[learningFormat]" activity for a maximum of [creditNumber] [creditType]. Physicians should claim only the credit commensurate with the extent of their participation in the activity. '
        ],
        creditDesignationStatement: [
          '[providerName] designates this "[learningFormat]" activity for a maximum of [creditNumber] AMA PRA Category 1 Credit(s)™. Physicians should claim only the credit commensurate with the extent of their participation in the activity.'
        ],
        creditAcceptanceStatement: []
      }
    };
  }

  static get optionE(): any {
    return {
      key: 'E',
      value: {
        label: '<p>You are an accredited continuing medical education (CME) provider <span class="bold">recognized by the ACCME</span>. Credit is awarded from the AAFP CME credit system.</p><br />' +
        '<p>Additional reading: <br/><a href="https://www.ama-assn.org/sites/default/files/media-browser/public/cme/pra-booklet_0.pdf" target="_blank">https://www.ama-assn.org/sites/default/files/media-browser/public/cme/pra-booklet_0.pdf</a></p>' +
        '<p>Note: AMA PRA Category 1 credits are not automatically considered to have AAFP prescribed credit status – they are automatically accepted as AAFP elective credit</p>' +
        '<p>Additional reading:<br /><a href="http://www.aafp.org/cme/about/types.html#considered-prescribed-credit" target="_blank">http://www.aafp.org/cme/about/types.html#considered-prescribed-credit</a> </p>',
        template: '',
        creditTypeOptions: [
          {key: 'AAFP-Prescribed', value: {label: 'AAFP Prescribed Credits'}},
          {key: 'AAFP-Elective', value: {label: 'AAFP Elective Credits'}}
        ],
        accreditationStatement: [
          '[providerName] is accredited by the Accreditation Council for Continuing Medical Education (ACCME) to provide continuing medical education to physicians.'
        ],
        creditDesignationStatement: [
          'This [learningFormat] activity, [courseTitle], with a begin date of [plannedPublicationDate], has been reviewed and is acceptable for up to [creditNumber] [creditType] credits by the American Academy of Family Physicians. Physicians should claim only the credit commensurate with the extent of their participation in the activity.'
        ],
        creditAcceptanceStatement: []
      }
    };
  }

  static get optionF(): any {
    return {
      key: 'F',
      value: {
        label: '<p><span class="bold">You are an AAFP accredited provider</span> and will offer an activity that qualifies for AAFP Prescribed or Elective Credits.</p>' +
        '<p>Additional reading:<br/> <a href="http://www.aafp.org/cme/about/types.html#considered-prescribed-credit" target="_blank">http://www.aafp.org/cme/about/types.html#considered-prescribed-credit</a> and <a href="http://www.aafp.org/dam/AAFP/documents/cme/accreditation/cme-credit-guide.pdf" target="_blank">http://www.aafp.org/dam/AAFP/documents/cme/accreditation/cme-credit-guide.pdf</a></p>' +
        '<p><span class="bold">Prescribed credit or Elective credit?</span><br/>An activity is eligible for <span class="bold">AAFP Prescribed credit</span> when it is designed primarily for physicians with content directly related to patient care, patient care delivery, or certain nonclinical topics. A family physician who is an AAFP active or life member must be directly involved in the development of the activity and attestation is required on the CME application.</p>' +
        '<p>An activity is eligible for <span class="bold">AAFP Elective credit</span> when it is primarily designed for health care professionals other than physicians. Direct involvement of an AAFP active or life member in the planning of the activity is not required.</p>' +
        '<p>Additional reading: <br/><a href="http://www.aafp.org/cme/about/types.html#considered-prescribed-credit" target="_blank">http://www.aafp.org/cme/about/types.html#considered-prescribed-credit</a> and <a href="http://www.aafp.org/dam/AAFP/documents/cme/accreditation/cme-credit-guide.pdf" target="_blank">http://www.aafp.org/dam/AAFP/documents/cme/accreditation/cme-credit-guide.pdf</a></p>',
        template: '',
        creditTypeOptions: [
          {key: 'AAFP-Prescribed', value: {label: 'AAFP Prescribed Credits'}},
          {key: 'AAFP-Elective', value: {label: 'AAFP Elective Credits'}}
        ],
        accreditationStatement: [
          'This activity is certified by the American Academy of Family Physicians for up to [creditNumber] [creditType] hours. AAFP Prescribed credit is accepted as equivalent to AMA PRA Category 1 Credit™ toward the AMA Physician’s Recognition Award (PRA). When applying for the AMA PRA, Prescribed credit earned must be reported as Prescribed Credit, not as Category 1.'
        ],
        creditDesignationStatement: [],
        creditAcceptanceStatement: []
      }
    };
  }

  static get optionF2(): any {
    return {
      key: 'F2',
      value: {
        label: '<p>You are creating an activity and will seek accreditation for your activity from EACCME</p><p>Additional reading: <br/><a href="https://www.uems.eu/__data/assets/pdf_file/0017/40157/EACCME-2.0-CRITERIA-FOR-THE-ACCREDITATION-OF-ELM-Version-6-07-09-16.pdf" target="_blank">https://www.uems.eu/__data/assets/pdf_file/0017/40157/EACCME-2.0-CRITERIA-FOR-THE-ACCREDITATION-OF-ELM-Version-6-07-09-16.pdf</a> and <a href="http://www.eaccme.eu" target="_blank">http://www.eaccme.eu"</a></p>',
        template: '',
        creditTypeOptions: [
          {key: 'ACMEC', value: {label: 'ACMEC credits'}}
        ],
        accreditationStatement: [
          '[courseTitle] [courseSubtitle] is accredited by the European Accreditation Council for Continuing Medical Education (EACCME) to provide the following CME activity for medical specialists. The EACCME is an institution of the European Union of Medical Specialists (UEMS)'
        ],
        creditDesignationStatement: [],
        creditAcceptanceStatement: []
      }
    };
  }

  static get optionG(): any {
    return {
      key: 'G',
      value: {
        label: '<p>You are an <span class="bold">ACGME</span> accredited provider of specialty and/or sub-specialty medical education programs that comply with the standards set by ACGME for student residency and fellowship programs and wants to offer online courses for learning and revision purposes.</p><p>Credits are not applicable but a certificate of completion may, if selected be offered to readers</p>',
        template: '',
        creditTypeOptions: [
          {key: 'notApplicable', value: {label: 'Not Applicable'}}
        ],
        accreditationStatement: [],
        creditDesignationStatement: [],
        creditAcceptanceStatement: []
      }
    };
  }

  static get optionH(): any {
    return {
      key: 'H',
      value: {
        label: '<p>For an activity that designates <span class="bold">AOA Category 1-A CME Credit(s)</span></p><br />' +
        '<p>You are an accredited continuing medical education (CME) provider recognized by the American Osteopathic Association (AOA) and has been approved for AOA CME.</p>' +
        '<p>Note: Category 1-A Requirements for Online CME Programs – Up to fifteen (15) Category 1-A credits may be earned from real time interactive CME or online, on-demand CME programs. To qualify for 1-A credit, online, on-demand CME programs must meet AOA requirements.</p>' +
        '<p>Additional reading: <br/><a href="https://www.osteopathic.org/inside-aoa/accreditation/Documents/cme-accreditation-requirements.pdf" target="_blank">https://www.osteopathic.org/inside-aoa/accreditation/Documents/cme-accreditation-requirements.pdf</a></p>',
        template: '',
        creditTypeOptions: [
          {key: 'AOA-CME-Category-1-A', value: {label: 'AOA Category 1-A CME Credit'}}
        ],
        accreditationStatement: [
          '[providerName] is accredited by the American Osteopathic Association to provide osteopathic continuing medical education for physicians'
        ],
        creditDesignationStatement: [
          '[providerName] has designated this [learningFormat] activity for a maximum of [creditNumber] AOA Category 1-A CME credits. Physicians should claim only the credit commensurate with the extent of their participation in the activity.'
        ],
        creditAcceptanceStatement: []
      }
    };
  }

  static get optionI(): any {
    return {
      key: 'I',
      value: {
        label: '<p>For an activity that designates <span class="bold">AOA Category 1-B CME Credit(s)</span> You are an accredited continuing medical education (CME) provider recognized by the American Osteopathic Association (AOA) and has been approved for AOA CME.</p>' +
        '<p>Category 1-B Requirements for Online CME Programs – CME Sponsors may provide Category 1-B credit through Internet on-demand activities or other on-demand activities provided through non-electronic means with video & audio, audio only, or audio and slide deck webinars. These activities are typically programs that are available on an on-demand schedule and are not a real-time, interactive simultaneous conference. To qualify for 1-B credit, participants must complete a test and post-test.</p>' +
        '<p>Additional reading: <br/><a href="https://www.osteopathic.org/inside-aoa/accreditation/Documents/cme-accreditation-requirements.pdf" target="_blank">https://www.osteopathic.org/inside-aoa/accreditation/Documents/cme-accreditation-requirements.pdf</a></p>',
        template: '',
        creditTypeOptions: [
          {key: 'AOA-CME-Category-1-B', value: {label: 'AOA Category 1-B CME Credit'}}
        ],
        accreditationStatement: [
          // Note, this was previously disabled. Why?
          '[providerName] has requested that the AOA Council on Continuing Medical Education approve this [learningFormat] program for [creditNumber] credits of [creditType] credits. Approval is currently pending. Physicians should claim only the credit commensurate with the extent of their participation in the activity.'
        ],
        creditDesignationStatement: [],
        creditAcceptanceStatement: []
      }
    };

  }

  static get optionI2(): any {
    return {
      key: 'I2',
      value: {
        label: '<p>For an activity that designates AOA Category 2-A CME Credit(s) Category 2-A includes formal educational programs that are sponsored by an ACCME accredited provider for AMA PRA Category 1 Credit™; approved by the American Academy of Family Physicians (AAFP) or approved by an' +
        'internationally known sponsor acceptable to the ACCME, or an AOA-accredited Category 1 CME Sponsor that does not meet the faculty/hours requirement for AOA Category 1-A credit.</p>' +
        '<p>Additional reading 1: <br/> <a href="https://www.osteopathic.org/inside-aoa/accreditation/Documents/cme-accreditation-requirements.pdf" target="_blank">https://www.osteopathic.org/inside-aoa/accreditation/Documents/cme-accreditation-requirements.pdf</a></p><br />' +
        '<p>Additional reading 2: <br/> <a href="https://www.osteopathic.org/inside-aoa/development/continuing-medical-education/Documents/cme-guide-2016-2018.pdf" target="_blank">https://www.osteopathic.org/inside-aoa/development/continuing-medical-education/Documents/cme-guide-2016-2018.pdf</a></p>',
        template: '',
        creditTypeOptions: [
          {key: 'AOA-CME-Category-2-A', value: {label: 'AOA Category 2-A CME Credit'}}
        ],
        accreditationStatement: [
          // Note, this was previously disabled. Why?
          '[providerName] has requested that the AOA Council on Continuing Medical Education approve this [learningFormat] program for [creditNumber] credits of [creditType] credits. Approval is currently pending. Physicians should claim only the credit commensurate with the extent of their participation in the activity.'
        ],
        creditDesignationStatement: [
        ],
        creditAcceptanceStatement: []
      }
    };
  }

  static get optionI3(): any {
    return {
      key: 'I3',
      value: {
        label: '<p><span class="bold">For an activity that designates AOA Category 2-B CME Credit(s)</span></p>' +
        '<p>You are an accredited continuing medical education (CME) provider recognized by the American Osteopathic Association (AOA) and has been approved for AOA CME.</p>' +
        '<p>Note: Category 2-B Credit Category 2-B credit shall be awarded for certain online activities, such as home study activities; viewing non-osteopathic medical video, audio or online CME activities.</p> ' +
        '<p>Additional reading: <br/><a href="http://www.osteopathic.org/inside-aoa/development/continuing-medical-education/Pages/category-2-a-and-2-b-credit.aspx" target="_blank">http://www.osteopathic.org/inside-aoa/development/continuing-medical-education/Pages/category-2-a-and-2-b-credit.aspx</a> </p>',
        template: '',
        creditTypeOptions: [
          {key: 'AOA-CME-Category-2-B', value: {label: 'AOA Category 2-B CME Credit'}}
        ],
        accreditationStatement: [
          // Note, this was previously disabled. Why?
          '[providerName] has requested that the AOA Council on Continuing Medical Education approve this [learningFormat] program for [creditNumber] credits of [creditType] credits. Approval is currently pending. Physicians should claim only the credit commensurate with the extent of their participation in the activity.'
        ],
        creditDesignationStatement: [],
        creditAcceptanceStatement: []
      }
    };
  }

  static get optionI4(): any {
    return {
      key: 'I4',
      value: {
        label: '<p>You are an accredited continuing medical education (CME) provider recognized by the American Osteopathic Association (AOA) and <span class="bold">approval is pending for AOA CME credit</span>.</p> ' +
        '<p>Additional reading: <br /> <a href="https://www.osteopathic.org/inside-aoa/accreditation/Documents/cme-accreditation-requirements.pdf" target="_blank">https://www.osteopathic.org/inside-aoa/accreditation/Documents/cme-accreditation-requirements.pdf</a><br/><a href="https://www.osteopathic.org/inside-aoa/accreditation/Documents/cme-accreditation-requirements.pdf" target="_blank">https://www.osteopathic.org/inside-aoa/accreditation/Documents/cme-accreditation-requirements.pdf</a></p>',
        template: '',
        creditTypeOptions: [
          {key: 'AOA-CME-Category-2-B', value: {label: 'AOA Category 2-B CME Credit'}},
          {key: 'pending', value: {label: 'Pending'}},
          {key: 'none', value: {label: 'None'}}
        ],
        accreditationStatement: [
          // Note, this was previously disabled. Why?
          '[providerName] has requested that the AOA Council on Continuing Medical Education approve this [learningFormat] program for [creditNumber] credits of [creditType] credits. Approval is currently pending. Physicians should claim only the credit commensurate with the extent of their participation in the activity.'
        ],
        creditDesignationStatement: [],
        creditAcceptanceStatement: []
      }
    };
  }

  static get optionJ(): any {
    return {
      key: 'J',
      value: {
        label: '<p>You are an accredited continuing medical education (CME) provider recognized by the American Academy of Physician Assistants (AAPA) and <span class="bold">has been approved for AAPA CME</span>.</p>' +
        '<p>Additional reading: <br/> <a href="http://www.aapa.org/learning-central/aapa-cme-accreditation/#tabs-3-eligibility-standards-policies" target="_blank">www.aapa.org/learning-central/aapa-cme-accreditation/#tabs-3-eligibility-standards-policies</a></p>',
        template: '',
        creditTypeOptions: [
          {key: 'AAPA-CME-Category-1', value: {label: 'AAPA Category 1 CME'}},
          {key: 'AAPA-PI-CME-Category-1', value: {label: 'AAPA Category 1 PI-CME'}},
          {key: 'AAPA-SA-CME-Category-1', value: {label: 'AAPA Category 1 SA CME'}}
        ],
        accreditationStatement: [
          'The American Academy of Physician Assistants (AAPA) accepts AMA PRA Category 1 Credit™ for the PRA from organizations accredited by ACCME'
        ],
        creditDesignationStatement: [
          'This activity has been reviewed and is approved for a maximum of [creditNumber] of [creditType] credits by the Physician Assistant Review Panel. Physician assistants should claim only those hours actually spent participating in the CME activity. This program was planned in accordance with AAPA’s CME Standards for [learningFormat] Programs and for Commercial Support of [learningFormat] Programs. This activity expires [expirationDate]'
        ],
        creditAcceptanceStatement: []
      }
    };
  }

  static get optionK(): any {
    return {
      key: 'K',
      value: {
        label: '<p>You are an accredited continuing medical education (CME) provider recognized by the American Academy of Physician Assistants (AAPA) and <span class="bold">has not been approved for AAPA CME</span>.</p>',
        template: '',
        creditTypeOptions: [
          {key: 'AAPA-CME-Category-1', value: {label: 'AAPA Category 1 CME'}},
          {key: 'AAPA-PI-CME-Category-1', value: {label: 'AAPA Category 1 PI-CME'}},
          {key: 'AAPA-SA-CME-Category-1', value: {label: 'AAPA Category 1 SA CME'}},
          {key: 'pending', value: {label: 'Pending'}},
          {key: 'none', value: {label: 'None'}}
        ],
        accreditationStatement: [
          // Note, this was previously disabled. Why?
          'This program is not yet approved for CME credit. [providerName] plans to request [creditNumber] hours of AAPA [creditType] CME credit from the Physician Assistant Review Panel. Total number of approved credits yet to be determined.'
        ],
        creditDesignationStatement: [],
        creditAcceptanceStatement: []
      }
    };
  }

  static get optionL(): any {
    return {
      key: 'L',
      value: {
        label: '<p>You are an accredited continuing medical education (CME) provider <span class="bold">recognized by the ACCME certified for AMA PRA credit</span> specifically for Physician Assistants (PA).</p>',
        template: '',
        creditTypeOptions: [
          {key: 'AMA-PRA-1', value: {label: 'AMA PRA Category 1 Credit(s)™'}},
          {key: 'AMA-PRA-2', value: {label: 'AMA PRA Category 2 Credit(s)™'}}
        ],
        accreditationStatement: [
          '[providerName] is accredited by the Accreditation Council for Continuing Medical Education (ACCME) to provide continuing medical education to physicians'
        ],
        creditDesignationStatement: [
          'NCCPA accepts certificates of participation for educational activities certified for [creditType] from organizations accredited by ACCME or a recognized State medical society. Physician assistants may receive a maximum of [creditNumber] hour(s) of [creditType] for completing this program.'
        ],
        creditAcceptanceStatement: []
      }
    };
  }

  static get optionM(): any {
    return {
      key: 'M',
      value: {
        label: '<p>You are an accredited continuing medical education (CME) provider <span class="bold">recognized by the ACCME certified for AOA category 1 credit</span> specifically for Physician Assistants (PA).</p>',
        template: '',
        creditTypeOptions: [
          {key: 'AOA-CME-Category-1-A', value: {label: 'AOA Category 1-A CME Credit'}}
        ],
        accreditationStatement: [
          '[providerName] is accredited by the American Osteopathic Association to provide osteopathic continuing medical education for physicians'
        ],
        creditDesignationStatement: [
          'NCCPA accepts certificates of participation for educational activities certified for AOA [creditType] Credit. Physician assistants may receive a maximum of [creditNumber] hours of Category I Credit for completing this program.'
        ],
        creditAcceptanceStatement: []
      }
    };
  }

  static get optionN(): any {
    return {
      key: 'N',
      value: {
        label: '<p>You are an accredited continuing medical education (CME) provider <span class="bold">recognized by the ACCME certified for AAFP Prescribed or Elective credits</span> specifically for Physician Assistants (PA).</p>',
        template: '',
        creditTypeOptions: [
          {key: 'AAFP-Prescribed', value: {label: 'AAFP Prescribed Credits'}},
          {key: 'AAFP-Elective', value: {label: 'AAFP Elective Credits'}}
        ],
        accreditationStatement: [],
        creditDesignationStatement: [
          'AAPA accepts certificates of participation for educational activities certified for [creditType] credit. Physician assistants may receive a maximum of [creditNumber] hour(s) of Category I credit for completing this program. PAs may claim a maximum of [creditNumber] Category 1 credits for completing this activity. NCCPA accepts AAFP Prescribed Credit.'
        ],
        creditAcceptanceStatement: []
      }
    };
  }

  static get optionO(): any {
    return {
      key: 'O',
      value: {
        label: '<p>You are an accredited continuing education provider recognized by the American Nurses Credentialing Center’s Commission on Accreditation (ANCC), certified for ANCC CE specifically for nursing.</p>' +
        '<p>Additional reading:<br/><a href="http://www.nursecredentialing.org/Accreditation" target="_blank"></a>http://www.nursecredentialing.org/Accreditation</p>',
        template: '',
        creditTypeOptions: [
          {key: 'contactHours', value: {label: 'Contact hours'}}
        ],
        accreditationStatement: [
          '[providerName] is accredited as a provider of continuing nursing education by the American Nurses Credentialing Center\'s Commission on Accreditation. ANCC Provider Number [anccProviderNumber]'
        ],
        creditDesignationStatement: [
          'A maximum of [creditNumber] [creditType] hours may be earned by learners who successfully complete this continuing nursing education activity. Participants must score [minimumPassingScore] or higher t pass this activity'
        ],
        creditAcceptanceStatement: []
      }
    };
  }

  static get optionP(): any {
    return {};
  }

  static get optionQ(): any {
    return {
      key: 'Q',
      value: {
        label: '<p>You are an accredited continuing education provider recognized by the Accreditation Council for Pharmacy Education (ACPE) certified for ACPE-CPE specifically for Pharmacy</p>' +
        '<p>Additional reading:<br/><a href="https://www.acpe-accredit.org/pdf/CPE_Policies_Procedures.pdf" target="_blank">https://www.acpe-accredit.org/pdf/CPE_Policies_Procedures.pdf</a>',
        template: '',
        creditTypeOptions: [
          {key: 'application-CPE-activity', value: {label: 'Application Based CPE Activity'}},
          {key: 'practice-CPE-activity', value: {label: 'Practice Based CPE Activity'}},
          {key: 'knowledge-CPE-activity', value: {label: 'Knowledge Based CPE Activity'}}
        ],
        accreditationStatement: [
          '[providerName] is accredited by the Accreditation Council for Pharmacy Education as a provider of continuing pharmacy education.'
        ],
        creditDesignationStatement: [
          'This activity is an [learningFormat] activity and has been approved for [creditNumber] contact hours of continuing education credit or [creditNumberDiv10] CEUs of [creditType]. ACPE Universal Activity Number [universalActivityNumber], (eg.0396-0000-14-056-L04-P)'
        ],
        creditAcceptanceStatement: []
      }
    };
  }

  static get optionR(): any {
    return {
      key: 'R',
      value: {
        label: 'You are an accredited continuing education provider recognized by an accrediting body not included above. This template includes a range of input options to assist you to compile a pre-activity accreditation statement, a designation statement and a completion statements or certificate.',
        template: '',
        creditTypeOptions: [
          {key: 'other', value: {label: 'Other'}}
        ],
        accreditationStatement: [
          '[providerName] is accredited by [accreditingOrganizationName] as a provider of continuing education to the standards stipulated by [accreditingOrganizationName].'
        ],
        creditDesignationStatement: [
          'At completion the designated [learningFormat] activity qualifies for a maximum of [creditNumber] of [accreditingOrganizationName] [creditType] credit(s). Physicians or other clinicians should claim only the credit commensurate with the extent of their participation in the activity.'
        ],
        creditAcceptanceStatement: []
      }
    };
  }

  static get optionS(): any {
    return {
      key: 'S',
      value: {
        label: 'You are not an accredited continuing education provider, and/or you have no need for this activity to be recognized by any accrediting body. Even so you want to produce a learning experience that follows generally accepted best practice. This template will help you do so.',
        template: '',
        creditTypeOptions: [
          {key: 'CME-hours', value: {label: 'CME Hours'}}
        ],
        accreditationStatement: [
          '</p>',
          '[providerName] is not offering this activity as an accredited provider of continuing education materials. ',
          'The material does not form part of a certification process and has not been reviewed. ',
          'User should not rely on, or attempt to apply, any part of the content for any purpose other than to participate in the activity. ',
          'The learning material is presented to participants according to the information set out below, if any, and no warranty is given or impled as to its accuracy. ',
          'You should only take this activity if you agree to do so on an ‘as supplied’ basis.',
          '</p>',
          '',
          '<p>',
          'At completion, and entirely for your own purpose, a statement of completiion is available to confirm you have successfully completed the activity',
          '</p>'
        ],
        creditDesignationStatement: [],
        creditAcceptanceStatement: []
      }
    };
  }
}

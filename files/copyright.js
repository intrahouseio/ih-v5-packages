const { PRODUCT_SITES } = require('../tools/constatnts');

function fileCopyright(platform, proc, product) {
  return (`
    Format: http://www.debian.org/doc/packaging-manuals/copyright-format/1.0/
    Upstream-Name: ${product.name === 'intraopc' ? 'IntraOPC' : 'Intra'}
    Source: https://${PRODUCT_SITES[product.name]}/en/license-en/
    
    Files: *
    Copyright: Copyright ${new Date().getFullYear()} ${product.name === 'intraopc' ? 'IntraOPC <support@intraopc.com' : 'Intra Team <support@ih-systems.com>'}
    License: ${product.name === 'intraopc' ? 'IntraOPC' : 'Intra'}
    
    Files: debian/*
    Copyright: Copyright ${new Date().getFullYear()} ${product.name === 'intraopc' ? 'IntraOPC <support@intraopc.com>' : 'Intra Team <support@ih-systems.com>'}
    License: ${product.name === 'intraopc' ? 'IntraOPC' : 'Intra'}
    
    License: ${product.name === 'intraopc' ? 'IntraOPC' : 'Intra'}
    CAREFULLY READ THE FOLLOWING LEGAL AGREEMENT (“LICENSE”) BEFORE YOU START USING THE SOFTWARE. YOU EXPRESSLY CONSENT TO BE BOUND BY THE TERMS AND CONDITIONS OF THIS LICENSE. IF YOU DO NOT AGREE TO THE TERMS OF THIS LICENSE, DO NOT INSTALL AND DO NOT USE THE SOFTWARE AND, IF PRESENTED WITH THE OPTION TO “ACCEPT” OR “DO NOT ACCEPT”, CLICK “DO NOT ACCEPT”.
    
    1. Definitions
    1.1 Software means software, license key, related materials and updates all rights to which are owned by ${product.name === 'intraopc' ? 'IntraOPC' : 'Intra'} LLC.
    1.2 Rightholder (owner of exclusive rights to the Software) means ${product.name === 'intraopc' ? 'IntraOPC' : 'Intra'} LLC.
    1.3 Computer means hardware for which the Software was designed where the Software will be installed and/or used.
    1.4 End User (You/Your) means individual(s) installing or using the Software on their own behalf or who are legally using a copy of the Software; or, if the Software is being downloaded or installed on behalf of an organization, End User (You) further means the organization for which the Software is downloaded or installed and it is represented hereby that such organization has authorized the person accepting this agreement to do so on its behalf.
    1.5 Partner(s) means organization(s) that distribute the Software based on an agreement with the Rightholder.
    1.6 Update(s) means all upgrades, revisions, patches, enhancements, fixes, additions and/or modifications of the Software.
    1.7 Documentation means accompanying printed and other materials, user manual, configuration guide, reference books, help files and similar printed and electronic documents, the rights to which are owned by ${product.name === 'intraopc' ? 'IntraOPC' : 'Intra'} LLC. The on-line version of the User Manual is available on the Rightholder website www.${PRODUCT_SITES[product.name]} and may be updated when necessary.
    1.8 Personal account – a page on the Rightholder's web site for the Software registration, download and update.
    2. General
    2.1 Subject to your full and ongoing compliance with the terms and conditions of this License, the Rightholder hereby grants to you, and you accept, a limited, nonexclusive license to use the Software. If you have received, downloaded and/or installed a trial version of the Software, you may use the Software only for evaluation purposes and only during the single applicable trial period, unless otherwise indicated, from the date of the initial installation. Any use of the Software for other purposes or beyond the applicable trial period is strictly prohibited.
    2.2 The Software may include any updates, enhancements, modifications, revisions, or additions to the Software made by the Rightholder and made available to an end-user who has a registered Personal Account. Notwithstanding the foregoing, the Rightholder shall be under no obligation to provide any updates, enhancements, modifications, revisions, or additions to the Software.
    2.3 If the license contract in its written form accompanies the Software, the terms of the software use defined in the license contract prevails over the current End User License Agreement.
    3. Permitted License Uses and Restrictions
    3.1 Your license to use the Software is conditioned on the following license restrictions, and any use of the Software in violation of any of these restrictions, or any of the other terms of this License is a breach of this License.
    3.2 You have the right to use a trial version of the Software for evaluation purposes without any charge for the single applicable trial period (30 days from the time of the Software activation) according to this License. If the Rightholder sets another duration for the single applicable trial period you will be informed via notification. After expiration of the trial period you must either purchase the license key for the Software activation or destroy the Software, the Documentation, all backup copies thereof, and all trial activation keys that you have obtained.
    3.3 Except to the Open-Sourced programs (as specified in Article 8 hereof), you may not reverse engineer, decompile, disassemble, or otherwise translate the Software or any license keys you have obtained.
    3.4 You have the right to make a copy of the Software solely for backup purposes and only to replace the legally owned copy if such copy is lost, destroyed or becomes unusable. This backup copy cannot be used for other purposes and must be destroyed when you lose the right to use the Software.
    3.5 You can transfer the license to use the Software to other individuals within the scope of the license granted by the Rightholder to you, provided that the recipient agrees to be bound by all the terms and conditions of this License and to replace you in full in the license granted by the Rightholder.
    3.6 You may not sublicense, lease, rent, or lend your rights in the Software, Documentation, or license keys, as granted by this Agreement, without prior written consent of the Rightholder.
    4. Term and Termination
    4.1 This License is effective upon your acceptance of the License, or upon your downloading, installing, accessing, and using the Software, even if you have not expressly accepted this License. This License shall continue in effect until expiration or termination as provided herein. Term-based Licenses terminate upon the expiration of the prepaid term, unless you have paid all applicable fees to extend the term.
    4.2 You may terminate this License at any time in which case you must completely delete the Software, the Documentation and all backup copies and activation keys obtained by you.
    4.3 In the event of any breach by you of any of the terms and conditions of this License, the Rightholder shall at any time without notice to you be entitled to terminate this License to use the Software without refunding the Software purchase price or any part thereof.
    5. Disclaimer of Warranties
    5.1 THE SOFTWARE IS PROVIDED “AS IS”. THE RIGHTHOLDER AND ITS PARTNERS MAKE NO REPRESENTATION AND GIVE NO WARRANTY AS TO ITS USE OR PERFORMANCE. EXCEPT FOR ANY WARRANTY, CONDITION, REPRESENTATION OR TERM THE EXTENT TO WHICH CANNOT BE EXCLUDED OR LIMITED BY APPLICABLE LAW, THE RIGHTHOLDER AND ITS PARTNERS MAKE NO WARRANTY, CONDITION, REPRESENTATION, OR TERM (EXPRESSED OR IMPLIED) AS TO ANY MATTER INCLUDING, WITHOUT LIMITATION, NON-INFRINGEMENT OF THIRD-PARTY RIGHTS, MERCHANTABILITY, SATISFACTORY QUALITY, INTEGRATION, OR APPLICABILITY FOR A PARTICULAR PURPOSE. YOU ASSUME ALL FAULTS, AND THE ENTIRE RISK AS TO PERFORMANCE AND RESPONSIBILITY FOR SELECTING THE SOFTWARE TO ACHIEVE YOUR INTENDED RESULTS, AND FOR THE INSTALLATION OF, USE OF, AND RESULTS OBTAINED FROM THE SOFTWARE.
    5.2 THE RIGHTHOLDER DOES NOT WARRANT THAT THE OPERATION OF THE SOFTWARE OR SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE, THAT THE SOFTWARE WILL BE COMPATIBLE OR WORK WITH ANY THIRD PARTY SOFTWARE. INSTALLATION OF THIS SOFTWARE MAY AFFECT THE USABILITY OF THIRD PARTY SOFTWARE, APPLICATIONS OR THIRD PARTY SERVICES.
    6. Limitation of Liability
    6.1 IN NO EVENT SHALL THE RIGHTHOLDER BE LIABLE TO YOU OR ANY PARTY RELATED TO YOU FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, EXEMPLARY, OR PUNITIVE DAMAGES (INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF BUSINESS PROFITS, BUSINESS INTERRUPTION, LOSS OF BUSINESS INFORMATION, LOSS OF DATA OR OTHER SUCH PECUNIARY LOSS), EVEN IF THE RIGHTHOLDER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. IN NO EVENT WILL THE TOTAL AGGREGATE AND CUMULATIVE LIABILITY OF THE RIGHTHOLDER AND ITS PARTNERS TO YOU FOR ANY AND ALL CLAIMS OF ANY KIND ARISING HEREUNDER DURING THE USE OF THE SOFTWARE OR IN CONNECTION THEREWITH EXCEED THE AMOUNT OF LICENSE FEES ACTUALLY PAID BY YOU FOR THE SOFTWARE GIVING RISE TO THE CLAIM IN THE TWELVE MONTHS PRECEDING THE CLAIM.
    7. Intellectual Property and Confidentiality
    7.1 You agree that the Software, the Documentation, the authorship, systems, ideas, methods of operation, and other information contained in the Software are proprietary intellectual property and/or the valuable trade secrets of the Rightholder or its Partners. This License does not grant you any rights, except as expressly set forth in this License, to the intellectual property, including any trademarks or service marks of the Rightholder or its Partners. You may not remove or alter any copyright notices or other proprietary notices on any copies of the Software.
    7.2 You agree that the Rightholder may collect and use your technical data and related information—including but not limited to technical information about your device, system and application software, and peripherals—that is gathered periodically to facilitate the provision of software updates, product support, and other services to you (if any) related to the Software. The Rightholder may use this information, as long as it is in a form that does not personally identify you, to operate, provide, improve, and develop the Rightholder’s products, services and technologies, to prevent or investigate fraudulent or inappropriate use of the Rightholder’s products, services, and technologies.
    7.3 To check the legitimacy of the Software use the Rightholder reserves the right to use means to verify that you have licensed copy of the Software. The Software can transmit to the Rightholder license information needed to verify the legitimacy of the Software use.
    7.4 You agree that the Rightholder in no event shall be liable for unauthorized access to your Computer and Software and/or unauthorized use of the information obtained while using the Software. You are liable for keeping confidential the information gathered by the Software.
    7.5 If Your license key is stolen, or if you suspect any improper or illegal usage of your license outside of your control you should promptly notify the Rightholder of such occurrence. A replacement license key may be issued to you and the suspect license key will be cancelled.
    8. Open Source (Free) Software
    8.1 The Software includes some programs that are licensed (or sublicensed) to the User under the GNU General Public License (GPL) or other similar Open Source software licenses which, among other rights, permit the User to modify those programs.
    8.2 You may modify or replace only these Open Source programs, subject to the terms and conditions of respective Open Source licenses. The Rightholder does not guarantee that the modified program resulting from the Software Update will be saved. The Rightholder is not obligated to provide updates, maintenance, warranty, technical or other support, or services for such resultant modified software.
    9. Applicable Law
    9.1 This License Agreement shall be governed by the laws of the ${product.name === 'intraopc' ? 'country of company' : 'Russian Federation'}.
    9.2 If any term or provision of this License is declared void or unenforceable in a particular situation, by any judicial or administrative authority, this declaration shall not affect the validity or enforceability of the remaining terms and provisions hereof or the validity or enforceability of the offending term or provision in any other situation. To the extent possible the provision will be interpreted and enforced to the greatest extent legally permissible in order to effectuate the original intent of this Agreement, and if no such interpretation or enforcement is legally permissible, shall be replaced by a provision of similar legal effect.
    10. Rightholder Contact Details
    You may contact ${product.name === 'intraopc' ? 'INTRAOPC' : 'INTRA'} LLC for further details about the Software and other products and services at the following website www.${PRODUCT_SITES[product.name]}
    (c) ${product.name === 'intraopc' ? 'IntraOPC' : 'Intra'} LLC, ${new Date().getFullYear()}
    \`/usr/share/common-licenses/GPL-3'
  `.replace(/    /g, '').trim());
}

module.exports = fileCopyright;
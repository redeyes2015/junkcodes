import requests
import xml.dom
import xml.dom.minidom as minidom
from redmine import Redmine
from getpass import getpass
import time
import re

s = requests.Session()

def do_login(username, password):
	r = s.get('http://mis.vivotek.tw/Security/Login.aspx')
	if r.status_code != 200:
		print 'get login page failed!'
		return False


	login_page = minidom.parseString(r.text.encode('utf-8'))
	inputs = login_page.getElementsByTagName('form')[0].getElementsByTagName('input')

	form_field = dict((i.getAttribute('name'), i.getAttribute('value')) for i in inputs)

	for k in form_field.keys():
		if 'txt_PWD' in k:
			form_field[k] = password
		elif 'loginid' in k:
			form_field[k] = username

	r = s.post('http://mis.vivotek.tw/Security/Login.aspx',
			data=form_field)
	return ('Log Out' in r.text)

def check_dbd_helper(text):
	text = re.sub('<font [^>]+>', '', text).replace('</font>', '')
	text = text.replace('cellpadding="0"', '')
	ripped = []
	in_script = False
	for l in text.splitlines():
		if '<script ' in l:
			in_script = True
		elif '</script>' in l:
			in_script = False
		elif not in_script:
			ripped.append(l)

	dbd_page = minidom.parseString('\n'.join(ripped).encode('utf-8'))

	content_table = filter(lambda t: t.getAttribute('id') == "MainContent_grv_grv", dbd_page.getElementsByTagName('table'))

	if len(content_table) < 1:
		print 'seems empty'
		return None

	print 'sth new!'
	content_table = content_table[0]
	rows = content_table.getElementsByTagName('tr')
	print 'rows count:', rows.length - 1
	dbd_info = []
	for row in rows[1:]:
		a_tags = row.getElementsByTagName('a')
		url = 'http://mis.vivotek.tw/dbd/' + a_tags[0].getAttribute('href')
		name = a_tags[1].firstChild.data
		dbd_info.append((url, name))
		print url
		print a_tags[0].firstChild.data
		print name
		print ''.join(['-'] * 80)
	return dbd_info

def redmine_update(username, password, dbd_info):
	server = Redmine('http://rd1-1/redmine', username=username, password=password)
	dbd_issue = server.issues[9305]
	description = 'Today\'s (%s) bendon:\n' % (time.strftime("%Y %m/%d"))
	description += '\n'.join(('%s %s' % (info[1], info[0])) for info in dbd_info)
	dbd_issue.description = description
	dbd_issue.save('auto-update')

username = raw_input('username please: ')
password = getpass('password please: ')

is_loggedin = False
while True:
	if not is_loggedin:
		print 'try to log in !'
		is_loggedin = do_login(username, password)
		if not is_loggedin:
			print 'login failed!'
			exit()

	print time.strftime('now is %H:%M:%S')

	r = s.get('http://mis.vivotek.tw/dbd/dbd.aspx')
	if 'Log Out' not in r.text:
		print 'Warn! Seems not logged in'
		is_loggedin = False
		continue

	dbd_info = check_dbd_helper(r.text)
	if dbd_info is not None:
		redmine_update(username, password, dbd_info)
		exit()
	time.sleep(60)

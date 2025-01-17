import mmh3
import base64
import string
import random
import sqlite3

class ShortURLGenerator:
    def __init__(self, db_path='short_urls.db', length=6, alphabet=string.ascii_letters + string.digits):
        """
        初始化短链生成器
        :param db_path: SQLite 数据库文件路径，默认为当前目录下的 short_urls.db
        :param length: 短链长度，默认为6
        :param alphabet: 生成短链所使用的字符集，默认为大小写字母和数字
        """
        self.length = length
        self.alphabet = alphabet
        self.conn = sqlite3.connect(db_path)
        self.cursor = self.conn.cursor()
        self._create_table()

    def _create_table(self):
        """
        创建存储短链的表
        """
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS short_urls (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                original_url TEXT NOT NULL,
                short_url TEXT NOT NULL UNIQUE
            )
        ''')
        self.conn.commit()

    def _hash_url(self, url):
        """
        使用 MurmurHash3 算法对 URL 进行哈希
        :param url: 原始 URL
        :return: 哈希后的值
        """
        return mmh3.hash(url, 0)  # 使用种子值为0进行哈希

    def _encode_hash(self, hash_value):
        """
        将哈希值编码为短链
        :param hash_value: 哈希后的值
        :return: 编码后的短链
        """
        hash_bytes = hash_value.to_bytes((hash_value.bit_length() + 7) // 8, byteorder='big', signed=True)
        encoded_bytes = base64.b64encode(hash_bytes).rstrip(b'=')
        encoded_str = encoded_bytes.decode('utf-8')
        return self._convert_to_alphabet(encoded_str)

    def _convert_to_alphabet(self, encoded_str):
        """
        将 base64 编码的字符串转换为指定字符集的短链
        :param encoded_str: base64 编码的字符串
        :return: 指定字符集的短链
        """
        short_url = ''
        for char in encoded_str:
            index = (ord(char) * 47) % len(self.alphabet)  # 使用一个简单的映射规则
            short_url += self.alphabet[index]
        return short_url[:self.length]  # 截取指定长度的短链

    def generate_short_url(self, url):
        """
        生成短链
        :param url: 原始 URL
        :return: 短链
        """
        self.cursor.execute('SELECT short_url FROM short_urls WHERE original_url = ?', (url,))
        result = self.cursor.fetchone()
        if result:
            return result[0]  # 如果原 URL 已经生成过短链，直接返回

        hash_value = self._hash_url(url)
        short_url = self._encode_hash(hash_value)

        # 检查短链是否唯一，如果不唯一则重新生成
        while True:
            try:
                self.cursor.execute('INSERT INTO short_urls (original_url, short_url) VALUES (?, ?)', (url, short_url))
                self.conn.commit()
                break
            except sqlite3.IntegrityError:  # 如果短链已存在，捕获异常并重新生成
                short_url = ''.join(random.choices(self.alphabet, k=self.length))

        return short_url

    def get_original_url(self, short_url):
        """
        根据短链查询原始长链接
        :param short_url: 短链
        :return: 原始长链接，如果不存在则返回 None
        """
        self.cursor.execute('SELECT original_url FROM short_urls WHERE short_url = ?', (short_url,))
        result = self.cursor.fetchone()
        if result:
            return result[0]
        else:
            return None
        
    def get_all_short_urls(self):
        """
        查询之前生成的所有短链及其对应的原始长链接
        :return: 返回格式为 [{"short_url1": "origin_url1"}, {"short_url2": "origin_url2"}, ...]
        """
        self.cursor.execute('SELECT short_url, original_url FROM short_urls')
        results = self.cursor.fetchall()
        return [{short_url: original_url} for short_url, original_url in results]

    def close(self):
        """
        关闭数据库连接
        """
        self.conn.close()

# 示例使用
generator = ShortURLGenerator()
original_url = "https://www.example.com/very/long/url/that/needs/to/be/shortened"
short_url = generator.generate_short_url(original_url)
retrieve_test = generator.get_original_url(short_url)
assert retrieve_test == original_url
print(f"Original URL: {original_url}")
print(f"Short URL: {short_url}")
generator.close()